<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id_from')->constrained('users')->onDelete('restrict');
            $table->foreignId('user_id_to')->nullable()->constrained('users')->onDelete('restrict');
            $table->string('subject')->nullable();
            $table->text('message')->nullable();
            $table->boolean('is_draft')->default(true);
            $table->binary('attachment')->nullable();
            $table->foreignId('reply_to')->nullable()->constrained('mails')->onDelete('set null');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mails');
    }
};
