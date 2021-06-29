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
    private float $ttl;

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

    public function get(): string
    {
        return self::$redis->get($this->key);
    }

    public function save(): void
    {
        self::$redis->set($this->key, $this->value);
    }

    public function save_query(): RedisComponent
    {
        $hash = "query-".md5($this->key);
        $json = json_encode($this->value);
        self::$redis->set($hash, $json);
        return $this;
    }

    public function get_query(): array
    {
        $hash = "query-".md5($this->key);
        $json = self::$redis->get($hash);
        if(!$json) return [];
        $array = json_decode($json, true);
        return $array;
    }
}