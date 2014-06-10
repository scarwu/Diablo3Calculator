<?php
/**
 * Api/Hero Controller Example 
 * 
 * @package     Diablo III Calculator
 * @author      ScarWu
 * @copyright   Copyright (c) 2014, ScarWu (http://scar.simcz.tw/)
 * @link        http://github.com/scarwu/Diablo3Calculator
 */

namespace OniApp\Controller\Api;

use Oni\Controller;
use Oni\Req;
use Oni\Res;

class HeroController extends Controller
{
    private $option;
    private $json;

    public function up()
    {
        $this->option = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE;
        $this->json = [
            'method' => Req::method(),
            'param' => Req::param(),
            'server' => $_SERVER,
            'post' => $_POST,
            'get' => $_GET
        ];
    }

    public function getAction()
    {
        Res::json($this->json, $this->option);
    }
}
