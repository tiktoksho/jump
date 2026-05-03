<?php

declare(strict_types=1);

namespace App\Providers;

use App\Core\Util;

final class MockProvider implements PaymentProviderInterface
{
    public function createDeposit(array $payload): array
    {
        $txid = Util::randomRef('MOCK');
        $valor = number_format((float)$payload['valor'], 2, '.', '');

        return [
            'txid' => $txid,
            'qrcode_texto' => '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540' . $valor . '5802BR5910HELIXWIN6009SAO PAULO62070503***6304ABCD',
            'qrcode_imagem' => '',
            'expiracao_minutos' => 30,
            'provider_ref' => $txid,
            'status' => 'pendente',
            'meta' => ['mock' => true],
        ];
    }

    public function getDepositStatus(array $deposit): array
    {
        $createdAt = strtotime($deposit['created_at'] ?? 'now') ?: time();
        $elapsed = time() - $createdAt;
        if ($elapsed >= 15) {
            return ['status' => 'aprovado', 'valor' => (float)$deposit['valor']];
        }
        return ['status' => 'pendente'];
    }
}

