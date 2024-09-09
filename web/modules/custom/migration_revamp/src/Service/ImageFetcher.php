<?php

namespace Drupal\migration_revamp\Service;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use GuzzleHttp\ClientInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;

/**
 * Service for fetching and saving images.
 */
class ImageFetcher {

  /**
   * The HTTP client.
   *
   * @var \GuzzleHttp\ClientInterface
   */
  protected $httpClient;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The file system service.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected $fileSystem;

  /**
   * The logger channel factory.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactoryInterface
   */
  protected $loggerFactory;

  /**
   * Constructs a new ImageFetcher object.
   *
   * @param \GuzzleHttp\ClientInterface $http_client
   *   The HTTP client.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   The file system service.
   * @param \Drupal\Core\Logger\LoggerChannelFactoryInterface $logger_factory
   *   The logger channel factory.
   */
  public function __construct(
    ClientInterface $http_client,
    EntityTypeManagerInterface $entity_type_manager,
    FileSystemInterface $file_system,
    LoggerChannelFactoryInterface $logger_factory
  ) {
    $this->httpClient = $http_client;
    $this->entityTypeManager = $entity_type_manager;
    $this->fileSystem = $file_system;
    $this->loggerFactory = $logger_factory;
  }

  /**
   * Fetches image details from the API and saves images in the directory.
   *
   * @param string $apiEndpoint
   *   The API endpoint to fetch image details.
   * @param string $baseDirectory
   *   The base directory to save the images.
   */
  public function fetchAndSaveImages($apiEndpoint, $baseDirectory) {
    // Fetching image details from the API.
    $response = $this->httpClient->get($apiEndpoint);

    // Decoding the JSON response.
    $imageDetails = json_decode($response->getBody(), TRUE);

    // Checking if the base directory exists, create it if not.
    if (!$this->fileSystem->prepareDirectory($baseDirectory, FileSystemInterface::CREATE_DIRECTORY)) {
      $this->loggerFactory->get('migration_revamp')->error('Unable to create directory: %directory', [
        '%directory' => $baseDirectory,
      ]);
      return;
    }
    // Saving images in the specified directory.
    foreach ($imageDetails as $image) {
      $filename = $image['filename'];
      $uri = $image['uri'];

      // Removing the filename to get only the nested directories.
      $nestedDirectories = pathinfo($filename, PATHINFO_DIRNAME);

      // Creating nested directories.
      $nestedDirectory = $baseDirectory . '/' . $nestedDirectories;
      $this->fileSystem->prepareDirectory($nestedDirectory, FileSystemInterface::CREATE_DIRECTORY);

      // Downloaing the image.
      $file_contents = file_get_contents($uri);

      // Saving the image in the specified directory.
      $destination_uri = $nestedDirectory . '/' . basename($filename);
      file_put_contents($destination_uri, $file_contents);

      $this->loggerFactory->get('migration_revamp')->notice('Image %filename saved to %destination.', [
        '%filename' => $filename,
        '%destination' => $destination_uri,
      ]);
    }
  }

}
