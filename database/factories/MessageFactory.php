<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $useGroup = $this->faker->boolean(50);

        return [
            'message'         => $this->faker->realText(200),
            'sender_id'       => $this->faker->randomElement(User::pluck('id')->toArray()),
            'receiver_id'     => $useGroup ? null : User::inRandomOrder()->first()->id,
            'group_id'        => $useGroup ? Group::inRandomOrder()->first()->id : null,
            'conversation_id' => $this->faker->optional()->randomElement(Conversation::pluck('id')->toArray()),
            'created_at'      => $this->faker->dateTimeBetween('-1 year'), // endDate: 'now' added by default
        ];
    }

    public function configure(): MessageFactory|Factory
    {
        return $this->afterCreating(function (Message $message) {
            if ($message->receiver_id === $message->sender_id) {
                $message->update([
                    'receiver_id' => User::where('id', '!=', $message->sender_id)
                        ->inRandomOrder()->first()->id,
                ]);
            }
        });
    }
}
