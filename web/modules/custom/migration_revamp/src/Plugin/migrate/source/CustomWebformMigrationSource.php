<?php

namespace Drupal\migration_revamp\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Row;

/**
 * Source plugin for webform submissions migration from a custom API.
 *
 * @MigrateSource(
 *   id = "custom_webform_migration_source"
 * )
 */
class CustomWebformMigrationSource extends SourcePluginBase {

  /**
   * The API URL from which to fetch webform submissions for the migration.
   *
   * @var string
   *   The URL pointing to the custom API endpoint providing the webform
   *   submissions data for migration.
   */
  protected $apiUrl = 'https://www.innoraft.com/webform-submissions/contact_us_form';

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return 'custom_webform_migration_source';
  }

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'submission_id' => $this->t('Submission ID'),
      'webform_data' => $this->t('Webform Data'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'submission_id' => [
        'type' => 'integer',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {                                        
    $data = $this->fetchData();
    return new \ArrayIterator($data);
  }

  /**
 * Fetching data from the API.
 */
protected function fetchData() {
  // Making an HTTP request to your API endpoint.
  $data = file_get_contents($this->apiUrl);
  $data = json_decode($data, TRUE);
  foreach ($data as &$record) {
    $record['webform_id'] = $record['webform_id'];
  }
  return $data;
}

}
