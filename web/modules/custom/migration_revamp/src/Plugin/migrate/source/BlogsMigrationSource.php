<?php

namespace Drupal\migration_revamp\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Plugin\migrate\source\SourcePluginInterface;

/**
 * Source plugin for custom migration.
 *
 * @MigrateSource(
 *   id = "blogs_migration_source"
 * )
 */
class BlogsMigrationSource extends SourcePluginBase  {
  
  /**
 * The API URL from which to fetch data for the migration.
 *
 * @var string
 *   The URL pointing to the Drupal 9 API endpoint providing the content
 *   data for migration. It also include necessary query parameter which is
 *   an authentication key for url authentication.
 *
 */
  protected $apiUrl = 'https://www.innoraft.com/migration/blogs?authentication_key=revamp@blogs';
  /**
   * {@inheritdoc}
   */
  public function fields() {    
    return [
      'nid'               => $this->t('Node ID'), 
      'title'             => $this->t('Title'),
      'body'              => $this->t('Body'),   
      'created'           => $this->t('Created'), 
      'field_blog_image'  => $this->t('Image'),
      'field_meta_tags'   => $this->t('Meta Tags'),
      'field_blogtags'    => $this->t('Blog Tags'),
      'field_banner_image'    => $this->t('Blog Tags'),
      'field_teaser_image' => $this->t('Teaser Image'),
      'status' => $this->t('Status'),
    ];  
  } 

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'nid' => [
        'type' => 'integer',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return 'blogs_migration_source';
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
   *  @return array
   *    returns array of blog data.
   */
  protected function fetchData() {
    // Making an HTTP request to our API endpoint.
    $data = file_get_contents($this->apiUrl);
    $data = json_decode($data, TRUE);
    foreach ($data as &$record) {
      $record['nid'] = $record['nid']; 
    }
    return $data;
  }
}
