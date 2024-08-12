<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/* @mixin User */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'avatar_url'        => $this->avatar ? Storage::url($this->avatar) : null,
            'name'              => $this->name,
            'email'             => $this->email,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
            'is_admin'          => $this->is_admin,
            // will be added later
            'last_message'      => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }
}
