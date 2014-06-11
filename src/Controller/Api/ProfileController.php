<?php
/**
 * Api/Profile Controller Example 
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

class ProfileController extends Controller
{
    private $url;

    public function up()
    {
        if (3 === count(Req::param())) {
            list($host, $name, $code) = Req::param();
            $this->url = "http://$host.battle.net/api/d3/profile/$name-$code/";
        } elseif (4 === count(Req::param())) {
            list($host, $name, $code, $id) = Req::param();
            $this->url = "http://$host.battle.net/api/d3/profile/$name-$code/hero/$id";
        } else {
            return false;
        }
    }

    public function getAction()
    {
        $client = curl_init();

        curl_setopt($client, CURLOPT_URL, $this->url);
        curl_setopt($client, CURLOPT_USERAGENT, 'Diablo III Calculator');
        curl_setopt($client, CURLOPT_HEADER, false);
        curl_setopt($client, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($client, CURLOPT_RETURNTRANSFER, true);

        $result = json_decode(curl_exec($client), true);

        Res::json($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
