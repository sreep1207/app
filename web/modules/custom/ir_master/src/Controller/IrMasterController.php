<?php

declare(strict_types=1);

namespace Drupal\ir_master\Controller;

use Drupal\Core\Controller\ControllerBase;


/**
 * Returns responses for General functionality routes.
 */
final class IrMasterController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke(): array {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('Test controller!'),
    ];

    return $build;
  }

}
