<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('mails')->insert([
            ['user_id_from' => 2, 'user_id_to' => 1, 'subject' => 'test', 'message' => 'This is a test message'],
            ['user_id_from' => 1, 'user_id_to' => 3, 'subject' => 'answer', 'message' => 'This is a test answer'],
            ['user_id_from' => 1, 'user_id_to' => 2, 'subject' => 'sure', 'message' => 'What is happening?'],
            ['user_id_from' => 3, 'user_id_to' => 1, 'subject' => 'fun', 'message' => 'Let us have some fun'],
            ['user_id_from' => 2, 'user_id_to' => 1, 'subject' => 'lunch', 'message' => 'It is lunch time']
        ]);
    }
}
