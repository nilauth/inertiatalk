<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'sender_id',
        'receiver_id',
        'group_id',
    ];

    // relations

    /*
     *  Get the sender of the message
     * */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /*
     *  Get the receiver of the message
     * */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /*
     *  Get the chat group that the message belongs to
     * */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /*
     *  Get the attachments sent with the message
     * */

    public function attachements(): HasMany
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
