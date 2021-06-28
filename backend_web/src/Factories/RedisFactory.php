<?php


namespace App\Factories;

use App\Components\Redis\RedisComponent;

final class RedisFactory
{
    public static function get_instance(): RedisComponent
    {
        return new RedisComponent();
    }
}