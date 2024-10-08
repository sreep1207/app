#!/bin/bash

# Set correct permissions for files and directories
chown -R appuser:www-data /var/www/html/test-drupal
chmod -R 755 /var/www/html/test-drupal

# Set permissions for files and directories using xargs
find /var/www/html/test-drupal -type f -print0 | xargs -0 chmod 640
find /var/www/html/test-drupal -type d -print0 | xargs -0 chmod 750

# Set permissions specifically for directories and files in /var/www/html/test-drupal/web/sites/default/files
chmod 770 /var/www/html/test-drupal/web/sites/default/files
find /var/www/html/test-drupal/web/sites/default/files -type d -print0 | xargs -0 chmod 770  # Set directories to 770
find /var/www/html/test-drupal/web/sites/default/files -type f -print0 | xargs -0 chmod 660  # Set files to 660

echo "Permissions and ownership set successfully."

