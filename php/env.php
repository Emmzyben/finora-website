<?php

/**
 * env.php — Application environment configuration
 *
 * Define all environment variables here. These are registered via putenv()
 * so that getenv() calls in config.php resolve correctly.
 */

$env = [
    // ─── Database ─────────────────────────────────────────────
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'u680323230_finora_db',
    'DB_USER' => 'u680323230_finora',
    'DB_PASS' => 'Nikido886@',

    // ─── Application ──────────────────────────────────────────
    'APP_NAME' => 'Finora API',
    'JWT_SECRET' => 'lsjnorhworusornjcsndsodsowuoroi',
    'JWT_TTL' => '86400',
];

foreach ($env as $key => $value) {
    // Only set if not already defined by a real system env var
    if (getenv($key) === false) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}
