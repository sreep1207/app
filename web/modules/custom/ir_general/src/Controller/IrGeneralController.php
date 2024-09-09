<?php

declare(strict_types=1);

namespace Drupal\ir_general\Controller;

use Drupal\Core\Controller\ControllerBase;


/**
 * Returns responses for IR General routes.
 */
final class IrGeneralController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke(): array {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('Created this controller for testing in kubernetes'),
    ];

    return $build;
  }

}
