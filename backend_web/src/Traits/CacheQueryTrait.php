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
    protected function get_cached(string $query, string $table=""): array
    {
        return RedisFactory::get()->set_key($query)->get_query($table);
    }

    protected function addto_cache(string $query, array $array, float $ttl=300, string $table=""): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($array)->save_query($table);
    }

    protected function get_cachedsingle(string $query): string
    {
        return RedisFactory::get()->set_key($query)->get_querysingle();
    }

    protected function addto_cachesingle(string $query, string $value, float $ttl=300): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($value)->save_querysingle();
    }

    protected function get_cachedcount(string $query, string $table=""): int
    {
        return RedisFactory::get()->set_key($query)->get_querycount($table);
    }

    protected function addto_cachecount(string $query, int $count, float $ttl=300, string $table=""): void
    {
        RedisFactory::get()->set_ttl($ttl)->set_key($query)->set_value($count)->save_querycount($table);
    }

    protected function cache_del_qandcount(string $query, string $table=""): void
    {
        RedisFactory::get()->set_key($query)->delete_query_and_count($table);
    }

    protected function cache_del_all(string $table): void
    {
        RedisFactory::get()->cache_del_all($table);
    }
}//CacheQueryTrait
