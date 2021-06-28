<?php
/**
 * @author Eduardo Acevedo Farje.
 * @link www.eduardoaf.com
 * @name App\Services\Dbs\CoreQueriesService
 * @file CoreQueriesService.php 1.0.0
 * @date 15-01-2018 19:00 SPAIN
 * @observations
 */
namespace App\Services\Dbs;

use App\Services\AppService;

final class CoreQueriesService extends AppService
{

    public function get_fields_min($sDb,$sTable)
    {
        $sSQL = "
        /*CoreQueriesService.get_fields_min*/
        SELECT information_schema.columns.column_name field_name
        FROM information_schema.columns 
        WHERE 1
        AND table_schema = '$sDb'
        AND table_name = '$sTable'        
        ";
        return $sSQL;
    }//get_fields

    public function get_fields($sDb,$sTable)
    {
        $sSQL = "
        /*CoreQueriesService.get_fields*/
        SELECT DISTINCT table_name,LOWER(column_name) AS field_name
        ,LOWER(DATA_TYPE) AS field_type
        ,IF(pkfields.field_name IS NULL,0,1) is_pk
        ,character_maximum_length AS field_length
        ,numeric_precision ntot
        ,numeric_scale ndec
        ,extra 
        FROM information_schema.columns 
        LEFT JOIN 
        (
            SELECT key_column_usage.column_name field_name
            FROM information_schema.key_column_usage
            WHERE 1
            AND table_schema = '$sDb'
            AND constraint_name = 'PRIMARY'
            AND table_name = '$sTable'
        ) AS pkfields
        ON information_schema.columns.column_name = pkfields.field_name
        WHERE table_name='$sTable'
        AND table_schema='$sDb'
        ORDER BY ordinal_position ASC
        ";
        return $sSQL;
    }//get_fields

    public function get_tables($sDb,$sTable=NULL)
    {
        $sSQL = "
        /*CoreQueriesService.get_tables*/
        SELECT table_name 
        FROM information_schema.tables 
        WHERE 1
        AND table_schema='$sDb'
        ";
        if($sTable) $sSQL .= " AND table_name='$sTable'";

        $sSQL .= " ORDER BY 1";
        //pr($sSQL,"sql");
        return $sSQL;
    }//get_tables

    public function get_field($sDb,$sTable,$sField)
    {
        $sSQL = "
        /*CoreQueriesService.get_fields*/
        SELECT DISTINCT table_name,LOWER(column_name) AS field_name
        ,LOWER(DATA_TYPE) AS field_type
        ,IF(pkfields.field_name IS NULL,0,1) is_pk
        ,character_maximum_length AS field_length
        ,numeric_precision ntot
        ,numeric_scale ndec
        ,extra 
        FROM information_schema.columns 
        LEFT JOIN 
        (
            SELECT key_column_usage.column_name field_name
            FROM information_schema.key_column_usage
            WHERE 1
            AND table_schema = '$sDb'
            AND constraint_name = 'PRIMARY'
            AND table_name = '$sTable'
        ) AS pkfields
        ON information_schema.columns.column_name = pkfields.field_name
        WHERE table_name='$sTable'
        AND table_schema='$sDb'
        AND LOWER(column_name) = '$sField'
        ORDER BY ordinal_position ASC
        ";
        return $sSQL;
    }//get_fields


}//CoreQueriesService