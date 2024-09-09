(function ($, Drupal, once) {
  Drupal.behaviors.customFormValidation = {
    attach: function (context, settings) {
      $(once('customFormValidation', "[name='files[upload_cv]']", context)).on('change', function(e) {
        var maxFileSize = drupalSettings.ir_master.max_filesize;
        maxFileSize = maxFileSize * 1024 * 1024;
        var fileSize = this.files[0].size;
        if (fileSize > maxFileSize) {
          e.preventDefault();
          setTimeout(() => {
          $('.form-validator-error-message').css('display', 'block');
          }, 1000);
        }
      });
    }
  };
})(jQuery, Drupal, once);
