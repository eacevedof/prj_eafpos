<?php


namespace App\Factories;

use App\Components\Redis\RedisComponent;

final class RedisFactory
{
    public static function get(): RedisComponent
    {
        return new RedisComponent();
    }
}