<?php

namespace Drupal\ir_master\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure ir_mater settings for this site.
 */
class IrMasterSettingsForm extends ConfigFormBase {

  /**
   * Config settings.
   *
   * @var string
   */
  const SETTINGS = 'ir_master.settings';

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ir_master_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      static::SETTINGS,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config(static::SETTINGS);

    $form['establishment_year'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Years of Establishment'),
      '#default_value' => $config->get('establishment_year'),
    ];
    $form['development_team'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Development Team'),
      '#default_value' => $config->get('development_team'),
    ];
    $form['service_uptime'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Service Uptime'),
      '#default_value' => $config->get('service_uptime'),
    ];
    $form['satisfied_clients'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Satisfied Clients'),
      '#default_value' => $config->get('satisfied_clients'),
    ];
    $form['completed_projects'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Completed Projects'),
      '#default_value' => $config->get('completed_projects'),
    ];
    $form['client_retention_rate'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Client Retention Rate'),
      '#default_value' => $config->get('client_retention_rate'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration.
    $this->config(static::SETTINGS)
      ->set('establishment_year', $form_state->getValue('establishment_year'))
      ->set('development_team', $form_state->getValue('development_team'))
      ->set('service_uptime', $form_state->getValue('service_uptime'))
      ->set('satisfied_clients', $form_state->getValue('satisfied_clients'))
      ->set('completed_projects', $form_state->getValue('completed_projects'))
      ->set('client_retention_rate', $form_state->getValue('client_retention_rate'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
