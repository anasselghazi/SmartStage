<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'                   => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required'                   => 'Le nom est obligatoire.',
            'nom.max'                        => 'Le nom ne doit pas dépasser 255 caractères.',
            'email.required'                 => 'L\'adresse email est obligatoire.',
            'email.email'                    => 'L\'adresse email n\'est pas valide.',
            'email.unique'                   => 'Cette adresse email est déjà utilisée.',
            'password.required'              => 'Le mot de passe est obligatoire.',
            'password.min'                   => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed'             => 'Les mots de passe ne correspondent pas.',
            'password_confirmation.required' => 'La confirmation du mot de passe est obligatoire.',
        ];
    }
}