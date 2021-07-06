<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link eduardoaf.com
 * @name App\Factories\EncryptFactory 
 * @file EncryptFactory.php v1.0.0
 * @date 25-06-2021 19:50 SPAIN
 * @observations
 */
namespace App\Factories;

use App\Services\Apify\EncryptsService;

final class EncryptFactory
{
    public static function get(): EncryptsService
    {
        return new EncryptsService();
    }
}//EncryptFactory
