<?php

namespace Drupal\migration_revamp\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SourcePluginBase;
use Drupal\migrate\Row;

/**
 * Source plugin for migrating users from Drupal 9.
 *
 * @MigrateSource(
 *   id = "users_migration_source"
 * )
 */
class UsersMigrationSource extends SourcePluginBase {

  /**
 * The URL of the external API for fetching user data.
 *
 * @var string
 */
  protected $apiUrl = 'https://www.innoraft.com/migration/users-data?authentication_key=revamp@users';

  /**
   * {@inheritdoc}
   */
  public function fields() {
    return [
      'uid'     => $this->t('User ID'),
      'name'    => $this->t('Username'),
      'mail'    => $this->t('Email'),
      'pass'    => $this->t('Password'),
      'picture' => $this->t('Picture'),
      'created' => $this->t('Created'),
      'changed' => $this->t('Changed'),
      'access'  => $this->t('Access'),
      'login'   => $this->t('Login'),
      'roles'   => $this->t('Roles'),
      'timezone'   => $this->t('timezone'),
      'first_name' => $this->t('First name'),
      'last_name' => $this->t('Last name')
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [
      'uid' => [
        'type' => 'integer',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    return 'users_migration_source';
  }

  /**
   * {@inheritdoc}
   */
  public function initializeIterator() {
    // Fetching user data from the external API.
    $data = $this->fetchData();

    // Checking if the data is not empty and is iterable.
    if (!empty($data) && is_array($data)) {
      return new \ArrayIterator($data);
    }

    // If the data is empty or not iterable, returning an empty iterator.
    return new \ArrayIterator([]);
  }

  /**
   * Fetch user data from the API.
   *
   * @return array
   *   An array of user data.
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
