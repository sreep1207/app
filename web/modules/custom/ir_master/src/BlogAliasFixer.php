<?php

namespace Drupal\ir_master;

use Drupal\redirect\Entity\Redirect;

/**
 * Defines class for blogs aliases fixing.
 */
class BlogAliasFixer {

  /**
   * Fix blog path aliases.
   *
   * @command ir_master:fix-blog-aliases
   * @description Fixes the blog path aliases and adds redirects.
   * @bootstrap full
   */
  public function fixBlogAliases() {
    $batch = [
      'title' => t('Fixing blog aliases...'),
      'operations' => [],
      'finished' => [__CLASS__, 'batchFinished'],
    ];

    $entityTypeManager = \Drupal::entityTypeManager();
    $nids = $entityTypeManager->getStorage('node')
      ->getQuery()
      ->condition('type', 'blog')
      ->accessCheck(TRUE)
      ->execute();

    $chunks = array_chunk($nids, 50);
    foreach ($chunks as $chunk) {
      $batch['operations'][] = [[__CLASS__, 'processBatch'], [$chunk]];
    }

    batch_set($batch);
  }

  /**
   * Batch process callback.
   */
  public static function processBatch($nids, &$context) {
    $entityTypeManager = \Drupal::entityTypeManager();
    $aliasManager = \Drupal::service('path_alias.manager');
    $redirectStorage = $entityTypeManager->getStorage('redirect');
  
    foreach ($nids as $nid) {
      $node = $entityTypeManager->getStorage('node')->load($nid);
      if ($node) {
        $current_alias = $aliasManager->getAliasByPath('/node/' . $nid);
        // Checking if the alias starts with '/blogs/'.
        if (strpos($current_alias, '/blogs/') === 0) {
          $new_alias = str_replace('/blogs/', '/blog/', $current_alias);
          // Saving the new alias using the path_alias storage.
          $path_alias = $entityTypeManager->getStorage('path_alias')->create([
            'path' => "/node/" . $nid,
            'alias' => $new_alias,
            'langcode' => "en",
          ]);
          $path_alias->save();
  
          // Checking if a redirect already exists for this alias.
          $existing_redirects = $redirectStorage->loadByProperties(['redirect_source__path' => $current_alias]);
          if (empty($existing_redirects)) {
            // Adding a redirect from the old alias to the new alias.
            $redirect = Redirect::create([
              'redirect_source' => $current_alias,
              'redirect_redirect' => 'internal:' . $new_alias,
              'status_code' => 301,
              'language' => 'en',
            ]);
            $redirect->save();
          }
          else {
            \Drupal::logger('ir_master')->debug('Redirect for ' . $current_alias . ' already exists.');
          }
        }
      }
    }
  }
  
  /**
   * Batch finished callback.
   */
  public static function batchFinished($success, $results, $operations) {
    if ($success) {
      \Drupal::logger('ir_master')->notice('All blog aliases have been fixed.');
    }
    else {
      \Drupal::logger('ir_master')->notice('An error occurred while fixing blog aliases.');
    }
  }

}
