<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['name' => 'Jane Doe', 'email' => 'jane@doe.com', 'password' => Hash::make('password')],
            ['name' => 'Jake Peralta', 'email' => 'jakeyboy@nypd.com', 'password' => Hash::make('peraltayouaregenious')],
            ['name' => 'Rosa Diaz', 'email' => 'rosa.diaz@nypd.com', 'password' => Hash::make('fckoff12345')],
            ['name' => 'Charles Boyle', 'email' => 'charlieboy@nypd.com', 'password' => Hash::make('tonyHasTheBestPizza')]
        ]);
    }
}
