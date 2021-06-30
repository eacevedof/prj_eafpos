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
    protected function get_cached(string $query): array
    {
        return RedisFactory::get()->set_key($query)->get_query();
    }

    protected function addto_cache(string $query, array $array, float $ttl=300): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($array)->save_query();
    }

    protected function get_cachedcount(string $query): int
    {
        return RedisFactory::get()->set_key($query)->get_querycount();
    }

    protected function addto_cachecount(string $query, int $count, float $ttl=300): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($count)->save_querycount();
    }

    protected function delete_all(string $query): void
    {
        RedisFactory::get()->set_key($query)->delete_query_and_count();
    }
}//CacheQueryTrait
