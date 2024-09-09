<?php

namespace Drupal\migration_revamp\Plugin\migrate\process;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\file\FileRepositoryInterface;
use Drupal\media\Entity\Media;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides an image_file_url_to_media plugin.
 *
 * Usage:
 *
 * @code
 * process:
 *   bar:
 *     plugin: image_file_url_to_media
 *     source: foo
 * @endcode
 *
 * @MigrateProcessPlugin(id = "image_file_url_to_media")
 */
final class ImageFileUrlToMedia extends ProcessPluginBase implements ContainerFactoryPluginInterface {

  /**
   * Constructs the plugin instance.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    private readonly AccountProxyInterface $currentUser,
    private readonly LanguageManagerInterface $languageManager,
    private readonly FileRepositoryInterface $fileRepository,
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new self(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_user'),
      $container->get('language_manager'),
      $container->get('file.repository'),
      $container->get('entity_type.manager'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property): mixed {
    // @todo Transform the value here.
    $image_data = [];
    $image_data = $row->getSourceProperty('banner_image');

    if (empty($image_data['src'])) {
      return NULL;
    }

    $imageName = $image_data['filename'] ?? 'InnoraftImage.jpg';
    $imageFile = file_get_contents($image_data['src']);
    $image = $this->fileRepository->writeData($imageFile, "public://" . $imageName, FileSystemInterface::EXISTS_REPLACE);

    // Ignore creating new media if media entity available with same file.
    $media_entities = $this->entityTypeManager->getStorage('media')->loadByProperties([
      'field_media_image' => $image->id(),
    ]);
    if (!empty($media_entities)) {
      foreach ($media_entities as $value) {
        return $value->id();
      }
    }

    $image_media = Media::create([
      'name' => $image_data['title'],
      'bundle' => 'image',
      'uid' => $this->currentUser->id(),
      'langcode' => $this->languageManager->getCurrentLanguage()->getId(),
      'status' => 1,
      'field_media_image' => [
        'target_id' => $image->id(),
        'alt' => $image_data['alt'] ?? 'Image',
        'title' => $image_data['title'] ?? 'Image',
      ],
    ]);
    $image_media->save();

    return $image_media->id();
  }

}
