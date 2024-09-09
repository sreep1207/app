<?php

namespace Drupal\ir_master\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\ir_master\BlogAliasFixer;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Creates the form for executing batch process from UI.
 */
class FixBlogAliasForm extends FormBase {

  protected $blogAliasFixer;

  public function __construct(BlogAliasFixer $blogAliasFixer) {
    $this->blogAliasFixer = $blogAliasFixer;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('ir_master.blog_alias_fixer')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'fix_blog_alias_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['fix_aliases'] = [
      '#type' => 'submit',
      '#value' => $this->t('Fix blog aliases'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Calling the fixBlogAliases method directly.
    $this->blogAliasFixer->fixBlogAliases();
    \Drupal::messenger()->addMessage($this->t('The blog aliases have been fixed successfully.'));
  }

}
