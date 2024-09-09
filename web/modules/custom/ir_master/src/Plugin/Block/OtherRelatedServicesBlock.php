<?php

namespace Drupal\ir_master\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides an other related services block.
 *
 * @Block(
 *   id = "ir_master_other_related_services",
 *   admin_label = @Translation("Other Related Services"),
 *   category = @Translation("Custom")
 * )
 */
final class OtherRelatedServicesBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new OtherRelatedServicesBlock instance.
   *
   * @param array $configuration
   *   The plugin configuration, i.e. an array with configuration values keyed
   *   by configuration option name. The special key 'context' may be used to
   *   initialize the defined contexts by setting it to an array of context
   *   values keyed by context names.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The current route match.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   */
  final public function __construct(array $configuration, $plugin_id, $plugin_definition, RouteMatchInterface $route_match, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->routeMatch = $route_match;
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_route_match'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $data = [];
    $current_node = $this->routeMatch->getParameter('node');

    // Cache tags for invalidating cache whenever a node is updated.
    $cache_tags = [];
    if ($current_node) {
      $cache_tags[] = 'node:' . $current_node->id();
    }
    // Check if the current node is a Level 1 service.
    if ($current_node && $current_node->hasField('field_service_level') && $current_node->get('field_service_level')->value == 'level_1_service') {
      // Handle the case for level_1_service separately.
      $parent_node_id = $current_node->field_related_top_level_service->target_id;
      // Fetching the L2 service titles of the current node's parent L1 service.
      $menu_tree = \Drupal::menuTree();
      $parameters = $menu_tree->getCurrentRouteMenuTreeParameters('main');
      $parameters->setRoot('');
      $tree = $menu_tree->load('main', $parameters);

      $l2_service = [
        'title' => [],
        'weight' => [],
      ];

      foreach ($tree as $item) {
        foreach ($item->subtree as $sub_item) {
          $l2_service['title'][] = $sub_item->link->getTitle();
          $l2_service['weight'][] = $sub_item->link->getWeight();
        }
      }

      // Sort L2 services based on weight.
      array_multisort($l2_service['weight'], SORT_ASC, $l2_service['title']);

      // Fetching related nodes based on L2 service titles.
      foreach ($l2_service['title'] as $item) {
        $query = $this->entityTypeManager->getStorage('node')->getQuery();
        $query->condition('title', $item);
        $query->condition('status', 1);
        $query->accessCheck(FALSE);
        $result = $query->execute();
        foreach ($result as $key => $value) {
          $related_nodes[] = $value;
        }
      }
      foreach ($related_nodes as $nid) {
        $cache_tags[] = 'node:' . $nid;
        $node = $this->entityTypeManager->getStorage('node')->load($nid);
        if ($current_node == NULL) {
          $data[] = [
            'title' => $node->title->value,
            'url' => $node->toUrl()->toString(),
            'icon_class' => $node?->field_icomoon_class?->value,
          ];
        }
        // Condition to avoid adding current page in related services list.
        elseif ($node->id() !== $current_node->id()) {
          $data[] = [
            'title' => $node->title->value,
            'url' => $node->toUrl()->toString(),
            'icon_class' => $node?->field_icomoon_class?->value,
          ];
        }
      }
    }
    else {
      // Fetching the L2 service titles of the current node's parent L1 service.
      $parent_node_id = $current_node->field_related_top_level_service->target_id;
      if (!empty($parent_node_id)) {
        $parent_node = $this->entityTypeManager->getStorage('node')->load($parent_node_id);
        // Fetching the L2 service titles of the current node's.
        $menu_tree = \Drupal::menuTree();
        $parameters = $menu_tree->getCurrentRouteMenuTreeParameters('main');
        $parameters->setRoot($parent_node->menu_link->getPluginId());
        $tree = $menu_tree->load('main', $parameters);
        $l2_service = [
          'title' => [],
          'weight' => [],
        ];

        foreach ($tree as $item) {
          foreach ($item->subtree as $sub_item) {
            foreach ($sub_item->subtree as $sub2_item) {
              if ($sub_item->link->getTitle() == $parent_node->getTitle()) {
                $l2_service['title'][] = $sub2_item->link->getTitle();
                $l2_service['weight'][] = $sub2_item->link->getWeight();
              }
            }
          }
        }

        // Sorting L2 services based on weight.
        array_multisort($l2_service['weight'], SORT_ASC, $l2_service['title']);
        // Fetching related nodes based on L2 service titles.
        foreach ($l2_service['title'] as $item) {
          $query = $this->entityTypeManager->getStorage('node')->getQuery();
          $query->condition('title', $item);
          $query->condition('status', 1);
          $query->accessCheck(FALSE);
          $result = $query->execute();
          foreach ($result as $key => $value) {
            $related_nodes[] = $value;
          }
        }

        foreach ($related_nodes as $nid) {
          // Max result cap for 5 related services.
          if (count($data) >= 5) {
            break;
          }
          $cache_tags[] = 'node:' . $nid;
          $node = $this->entityTypeManager->getStorage('node')->load($nid);
          if ($current_node == NULL) {
            $data[] = [
              'title' => $node->title->value,
              'url' => $node->toUrl()->toString(),
              'icon_class' => $node?->field_icomoon_class?->value,
            ];
          }
          // Condition to avoid adding current page in related services list.
          elseif ($node->id() !== $current_node->id()) {
            $data[] = [
              'title' => $node->title->value,
              'url' => $node->toUrl()->toString(),
              'icon_class' => $node?->field_icomoon_class?->value,
            ];
          }
        }
      }
    }

    return [
      '#theme' => 'other_related_services',
      '#data' => $data,
      '#cache' => [
        'tags' => $cache_tags,
        'contexts' => [
          'url',
        ],
      ],
    ];
  }

}
