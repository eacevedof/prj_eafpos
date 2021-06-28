<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Traits\CacheQueryTrait
 * @file CacheQueryTrait.php 1.0.0
 * @date 01-11-2018 19:00 SPAIN
 * @observations
 */
namespace App\Traits;

use App\Factories\RedisFactory;

trait CacheQueryTrait
{
    protected function cacheget(string $query): array
    {
        return RedisFactory::get()->set_key($query)->get_query();
    }

    protected function cacheset(string $query, array $array, float $ttl=300): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($array)->save_query();
    }
}//CacheQueryTrait
