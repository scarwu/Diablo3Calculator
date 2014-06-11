<?php
/**
 * Bootstrap src 
 * 
 * @package     Diablo III Calculator
 * @author      ScarWu
 * @copyright   Copyright (c) 2012-2014, ScarWu (http://scar.simcz.tw/)
 * @link        http://github.com/scarwu/Diablo3Calculator
 */

// Set Default Time Zone
date_default_timezone_set('Etc/UTC');

$root = realpath(dirname(__FILE__) . '/../..');

// Require Composer Autoloader
require "$root/vendor/autoload.php";

// New Application Instance
$app = new Oni\App();

$app->set('controller', "$root/src/Controller");
$app->set('view', "$root/src/View");
$app->set('static', "$root/src/Static");
$app->set('cache', "$root/src/Cache");

$app->run();
