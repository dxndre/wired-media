<?php
/**
 * Plugin Name: WP Quickcheck
 * Description: Custom plugin built as part of a Technical Exam for Wired Media.
 * Version: 1.0.0
 * Author: D'André Phillips
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ENQUEUE STYLES & SCRIPTS
function wpqc_enqueue_assets() {
    wp_enqueue_style(
        'wpqc-style',
        plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'wpqc-js',
        plugin_dir_url( __FILE__ ) . 'assets/js/quickcheck.js',
        ['jquery'],
        '1.0.0',
        true
    );

    // LOCALIZE AJAX DATA FOR JS
    wp_localize_script('wpqc-js', 'wpqc_ajax_obj', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('qc_nonce')
    ]);
}
add_action( 'wp_enqueue_scripts', 'wpqc_enqueue_assets' );


// CREATE TABLE ON PLUGIN ACTIVATION
register_activation_hook( __FILE__, 'wpqc_create_table' );
function wpqc_create_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'qc_entries';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id INT NOT NULL AUTO_INCREMENT,
        content VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}


// SHORTCODE FUNCTION
function wpqc_quickcheck_shortcode() {
    ob_start();
    ?>

    <form class="quickcheck-form">
        <div class="form-inner">
            <label for="wpqc_text">Write something:</label><br>
            <div class="input-section">
                <input type="text" name="wpqc_text" id="wpqc_text" placeholder="Write Something..." required />
                <button type="submit" id="qc-submit" class="disabled" disabled>Submit</button>
            </div>
            <div class="character-count-section">
                <span class="char-count">Character Count: <span class="count-number too-short">0</span></span>
            </div>
        </div>
    </form>

    <div class="results">
        <h3>Your last 5 entries</h3>
        <div id="entries-container"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('qc_form', 'wpqc_quickcheck_shortcode');


// AJAX HANDLER: INSERT ENTRY
function wpqc_submit_entry() {
    global $wpdb;

    check_ajax_referer('qc_nonce', 'nonce'); // VERIFY NONCE

    $content = isset($_POST['content']) ? sanitize_text_field($_POST['content']) : '';

    if ( empty($content) || strlen($content) < 3 ) {
        wp_send_json_error(['message' => 'Content must be at least 3 characters']);
    }

    $table_name = $wpdb->prefix . 'qc_entries';
    $inserted = $wpdb->insert(
        $table_name,
        [
            'content'    => $content,
            'created_at' => current_time('mysql')
        ],
        ['%s', '%s']
    );

    if ($inserted) {
        wp_send_json_success([
            'message' => 'Saved successfully!',
            'id'      => $wpdb->insert_id,
            'content' => $content
        ]);
    }

    wp_send_json_error(['message' => 'Database insert failed']);
}
add_action('wp_ajax_qc_submit_entry', 'wpqc_submit_entry');
add_action('wp_ajax_nopriv_qc_submit_entry', 'wpqc_submit_entry');


// AJAX HANDLER: GET ALL ENTRIES
function wpqc_get_entries_ajax() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'qc_entries';

    // Get last 5 entries only
    $results = $wpdb->get_results(
        "SELECT id, content, created_at 
         FROM $table_name 
         ORDER BY created_at DESC 
         LIMIT 5",
        ARRAY_A
    );

    wp_send_json($results);
    wp_die();
}

add_action('wp_ajax_wpqc_get_entries', 'wpqc_get_entries_ajax');
add_action('wp_ajax_nopriv_wpqc_get_entries', 'wpqc_get_entries_ajax');
