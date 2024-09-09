<?php

namespace Drupal\ir_general\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Handles setting and applying CSP with nonce.
 */
class CSPResponseSubscriber implements EventSubscriberInterface {
  // Define a constant for the nonce key.
  const NONCE_KEY = 'csp_nonce';

  /**
   * Sets a nonce in the request attributes during the request phase.
   */
  public function onRequest(RequestEvent $event) {
    $nonce = bin2hex(random_bytes(16));
    $event->getRequest()->attributes->set(self::NONCE_KEY, $nonce);
  }

  /**
   * Alters the response to include CSP headers using the nonce.
   */
  public function onResponse(ResponseEvent $event) {
    $request = $event->getRequest();
    if ($nonce = $request->attributes->get(self::NONCE_KEY)) {
      $response = $event->getResponse();
      $current_csp = $response->headers->get('Content-Security-Policy');
      $updated_csp = str_replace("{SERVER-GENERATED-NONCE}", $nonce, $current_csp);
      $response->headers->set('Content-Security-Policy', $updated_csp);
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      KernelEvents::REQUEST => ['onRequest', 100],
      KernelEvents::RESPONSE => ['onResponse', -10],
    ];
  }

}
