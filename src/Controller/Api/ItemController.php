<?php
/**
 * Api/Item Controller Example 
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

class ItemController extends Controller
{
    private $url;

    public function up()
    {
        if (2 === count(Req::param())) {
            list($host, $item) = Req::param();
            $this->url = "http://$host.battle.net/api/d3/data/item/$item";
        } else {
            http_response_code(404);
            Res::json([
                'status' => 404
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

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

        if (null === $result || 'NOTFOUND' === $result['code']) {
            http_response_code(404);
            Res::json([
                'status' => 404
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } else {
            Res::json($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
    }
}
