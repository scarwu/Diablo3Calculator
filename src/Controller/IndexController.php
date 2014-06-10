<?php
/**
 * Index Controller Example 
 * 
 * @package     Diablo III Calculator
 * @author      ScarWu
 * @copyright   Copyright (c) 2014, ScarWu (http://scar.simcz.tw/)
 * @link        http://github.com/scarwu/Diablo3Calculator
 */

namespace OniApp\Controller;

use Oni\Controller;
use Oni\Req;
use Oni\Res;

class IndexController extends Controller
{
    public function getAction()
    {
        Res::html('index');
    }
}
