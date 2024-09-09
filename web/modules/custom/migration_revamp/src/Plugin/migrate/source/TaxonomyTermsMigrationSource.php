<?php

namespace Drupal\migration_revamp\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Row;

/**
 * Source plugin for migrating taxonomy terms from an API.
 *
 * @MigrateSource(
 *   id = "taxonomy_terms_migration_source"
 * )
 */
class TaxonomyTermsMigrationSource extends SourcePluginBase {

  protected $apiUrl = 'https://www.innoraft.com/terms-data?authentication_key=revamp@terms';

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'name' => $this->t('Name'),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'tid' => [
        'type' => 'integer',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return 'taxonomy_terms_migration_source';
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
   * 
   * @return array
   *  returns array of taxonomy terms from the API.
   */
  protected function fetchData() {
    $data = file_get_contents($this->apiUrl);
    $data = json_decode($data, TRUE);
    return $data;
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    return parent::prepareRow($row);
  }
}
