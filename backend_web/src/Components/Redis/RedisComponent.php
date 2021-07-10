<?php

namespace App\Components\Redis;

use \Redis;

final class RedisComponent
{
    private const REDIS_SERVER = "host.docker.internal";
    private const REDIS_PORT = "6379";
    private static $redis;

    private string $key;
    private $value;
    private float $ttl; //seconds ejemplo 300.5

    public function __construct()
    {
        if(!self::$redis)
        {
            self::$redis = new Redis();
            self::$redis->connect(self::REDIS_SERVER, self::REDIS_PORT);
        }
    }

    public function set_key(string $key): RedisComponent
    {
        $this->key = $key;
        return $this;
    }

    public function set_value($mxvalue): RedisComponent
    {
        $this->value = $mxvalue;
        return $this;
    }

    public function set_ttl(float $seconds): RedisComponent
    {
        $this->ttl = $seconds;
        return $this;
    }

    public function get_bykey(): string
    {
        return self::$redis->get($this->key);
    }

    public function save(): void
    {
        self::$redis->set($this->key, $this->value);
    }

    public function set(string $key, string $value, float $expire=300): void
    {
        self::$redis->set($key, $value);
        self::$redis->expire($key, $expire);
    }

    public function get(string $key)
    {
        return self::$redis->get($key);
    }

    public function save_query(string $table = ""): RedisComponent
    {
        $prefix = "query-";
        if($table) $prefix .= "$table-";
        $hash = $prefix.md5($this->key);
        $json = json_encode($this->value);
        self::$redis->set($hash, $json);
        self::$redis->expire($hash, $this->ttl);
        return $this;
    }

    public function get_query(string $table = ""): array
    {
        $prefix = "query-";
        if($table) $prefix .= "$table-";
        $hash = $prefix.md5($this->key);
        $json = self::$redis->get($hash);
        if(!$json) return [];
        $array = json_decode($json, true);
        return $array;
    }

    public function save_querycount(string $table = ""): RedisComponent
    {
        $prefix = "query-count-";
        if($table) $prefix .= "$table-";
        $hash = $prefix.md5($this->key);
        self::$redis->set($hash, (int) $this->value);
        self::$redis->expire($hash, $this->ttl);
        return $this;
    }

    public function get_querycount(string $table = ""): int
    {
        $prefix = "query-count-";
        if($table) $prefix .= "$table-";
        $hash = $prefix.md5($this->key);
        $count = self::$redis->get($hash);
        return (int) $count;
    }

    public function delete_query_and_count(string $table = ""): void
    {
        $prefix = "query-";
        if($table) $prefix .= "$table-";
        $hash1 = $prefix.md5($this->key);

        $prefix = "query-count-";
        if($table) $prefix .= "$table-";
        $hash2 = $prefix.md5($this->key);

        self::$redis->del($hash1, $hash2);
    }

    public function cache_del_all(string $table): void
    {
        $keys1 = self::$redis->keys("query-$table-*");
        $keys = self::$redis->keys("query-count-$table-*");
        $keys = array_merge($keys1,$keys);
        foreach ($keys as $key)
            self::$redis->del($key);
    }

    public function get_querysingle(): string
    {
        $hash = "query-single-".md5($this->key);
        if(!$value = self::$redis->get($hash)) return "";
        return $value;
    }

    public function save_querysingle(): RedisComponent
    {
        $hash = "query-single-".md5($this->key);
        self::$redis->set($hash, $this->value);
        self::$redis->expire($hash, $this->ttl);
        return $this;
    }
}