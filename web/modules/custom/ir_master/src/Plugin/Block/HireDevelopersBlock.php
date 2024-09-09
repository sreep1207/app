<?php

namespace Drupal\ir_master\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Menu\MenuLinkTreeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\menu_link_content\MenuLinkContentStorageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Hire Developers' block.
 *
 * @Block(
 *  id = "hire_developer",
 *  admin_label = @Translation("Hire Developers"),
 *  category = @Translation("Innoraft")
 * )
 */
class HireDevelopersBlock extends BlockBase implements ContainerFactoryPluginInterface {
  /**
   * The menu tree service.
   *
   * @var \Drupal\Core\Menu\MenuLinkTreeInterface
   */
  protected $menuTree;

  /**
   * The menu_link_content storage handler.
   *
   * @var \Drupal\menu_link_content\MenuLinkContentStorageInterface
   */
  protected $menuLinkContentStorage;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new self(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('menu.link_tree'),
      $container->get('entity_type.manager')->getStorage('menu_link_content')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MenuLinkTreeInterface $menu_tree, MenuLinkContentStorageInterface $menu_link_content_storage) {
    $this->menuTree = $menu_tree;
    $this->menuLinkContentStorage = $menu_link_content_storage;
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $list = [];
    $menu_name = 'main';
    $parameters = $this->menuTree->getCurrentRouteMenuTreeParameters($menu_name);
    $tree = $this->menuTree->load($menu_name, $parameters);
    $manipulators = [
    ['callable' => 'menu.default_tree_manipulators:checkAccess'],
    ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $this->menuTree->transform($tree, $manipulators);

    foreach ($tree as $item) {
      $title = $item->link->getTitle();
      $title = strtolower($title);
      // Check if the title contains "Technologies" and has children.
      if (strpos($title, 'technologies') !== FALSE && !empty($item->subtree)) {
        foreach ($item->subtree as $child) {
          $childTitle = $child->link->getTitle();

          // Check if the child menu item is "Hire Experts"
          // and has grandchildren.
          if (strpos($childTitle, 'Hire Experts') !== FALSE
            && !empty($child->subtree)) {
            foreach ($child->subtree as $grandChild) {
              $grandChildTitle = $grandChild->link->getTitle();
              $list[] = [
                '#type' => 'link',
                '#url' => $grandChild->link->getUrlObject(),
                '#title' => $grandChildTitle,
              ];
            }
          }
        }
      }
    }

    if (!empty($list)) {
      $list = [
        '#theme' => 'item_list',
        '#list_type' => 'ul',
        '#items' => $list,
      ];
    }

    return $list;
  }

}
