<?php

namespace Drupal\ir_master\EventSubscriber;

use Drupal\Core\Routing\RouteMatchInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Redirects nodes of frequently_asked_questions content type to /home.
 */
class RedirectToHomeSubscriber implements EventSubscriberInterface {

  /**
   * The route match service.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * Constructs a new RedirectToHomeSubscriber object.
   *
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The route match service.
   */
  public function __construct(RouteMatchInterface $route_match) {
    $this->routeMatch = $route_match;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['redirectFaqNodes'];
    return $events;
  }

  /**
   * Redirects nodes of frequently_asked_questions content type to /home.
   */
  public function redirectFaqNodes(RequestEvent $event) {
    // Checking if the current route is a node page.
    if ($node = $this->routeMatch->getParameter('node')) {
      // Checking if the node is of the frequently_asked_questions content type.
      if ($node->getType() == 'frequently_asked_questions') {
        if ($this->routeMatch->getRouteName() == 'entity.node.canonical') {
          // Redirecting to homepage.
          $response = new RedirectResponse('/faqs', RedirectResponse::HTTP_MOVED_PERMANENTLY);
          $event->setResponse($response);
        }
      }
    }
  }

}
