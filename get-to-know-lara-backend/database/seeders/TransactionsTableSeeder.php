<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TransactionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('transactions')->insert([
            ['user_id' => 2, 'mail_id' => 1, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 1, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 1, 'mail_id' => 2, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 3, 'mail_id' => 2, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 1, 'mail_id' => 3, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 2, 'mail_id' => 3, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 3, 'mail_id' => 4, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 4, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 3, 'mail_id' => 5, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 5, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 4, 'mail_id' => 6, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 6, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 2, 'mail_id' => 7, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 7, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 3, 'mail_id' => 8, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 8, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 3, 'mail_id' => 9, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 9, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null],
            ['user_id' => 2, 'mail_id' => 10, 'sent_at' => now(), 'received_at' => null, 'opened_at' => now()],
            ['user_id' => 1, 'mail_id' => 10, 'sent_at' => null, 'received_at' => now(), 'opened_at' => null]
        ]);
    }
}
