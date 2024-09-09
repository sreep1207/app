<?php

/**
 * @file
 * Builds placeholder replacement tokens for counter number data.
 */

use Drupal\Core\Render\BubbleableMetadata;

/**
 * Implements hook_token_info().
 */
function ir_master_token_info() {

  $type = [
    'name' => t('Counter Token'),
    'description' => t('Tokens for number counters.'),
  ];
  $content['year_of_establishment'] = [
    'name' => t("Years of Establishment"),
    'description' => t('Years of Establishment'),
  ];
  $content['development_team'] = [
    'name' => t("Development Team"),
    'description' => t('Development Team'),
  ];
  $content['service_uptime'] = [
    'name' => t("Service Uptime"),
    'description' => t('Servie Uptime'),
  ];
  $content['satisfied_clients'] = [
    'name' => t("Satisfied Clients"),
    'description' => t('Satisfied Clients'),
  ];
  $content['completed_projects'] = [
    'name' => t("Completed Projects"),
    'description' => t('Completed Projects'),
  ];
  $content['client_retention_rate'] = [
    'name' => t("Clients Retention Rate"),
    'description' => t('Client Retention Rate'),
  ];

  return [
    'types' => ['countertoken' => $type],
    'tokens' => ['countertoken' => $content],
  ];
}

/**
 * Implements hook_tokens().
 */
function ir_master_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata) {

  $replacements = [];
  $config = \Drupal::config('ir_master.settings');
  if ($type == 'countertoken') {
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'year_of_establishment':
          $replacements[$original] = $config->get('establishment_year');
          break;

        case 'development_team':
          $replacements[$original] = $config->get('development_team');
          break;

        case 'service_uptime':
          $replacements[$original] = $config->get('service_uptime');
          break;

        case 'satisfied_clients':
          $replacements[$original] = $config->get('satisfied_clients');
          break;

        case 'completed_projects':
          $replacements[$original] = $config->get('completed_projects');
          break;

        case 'client_retention_rate':
          $replacements[$original] = $config->get('client_retention_rate');
          break;
      }
    }
  }
  return $replacements;
}
