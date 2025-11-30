<?php
/**
 * Plugin Name: WP Quickcheck
 * Description: Custom plugin built as part of a Technical Exam for Wired Media.
 * Version: 1.0.0
 * Author: D'André Phillips
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Compiling SCSS > CSS for output
function wpqc_enqueue_assets() {
    wp_enqueue_style(
        'wpqc-style',
        plugin_dir_url( __FILE__ ) . 'assets/css/style.css',
        [],
        '1.0.0'
    );
}
add_action( 'wp_enqueue_scripts', 'wpqc_enqueue_assets' );


function wpqc_quickcheck_shortcode() {
    // If the form was submitted, process it securely
    $output = '';

    if ( isset($_POST['wpqc_submit']) ) {

        // Verify the nonce for security
        if ( ! isset($_POST['wpqc_nonce']) || ! wp_verify_nonce($_POST['wpqc_nonce'], 'wpqc_form_action') ) {
            $output .= '<p style="color:red;">Security check failed. Please try again.</p>';
        } else {

            // Sanitize user input
            $input = sanitize_text_field( $_POST['wpqc_text'] );

            // Example processing — replace with your own logic
            $output .= '<p>You entered: <strong>' . esc_html($input) . '</strong></p>';
        }
    }

    // Start output buffering for clean HTML
    ob_start();
    ?>

    <form class="quickcheck-form" method="post" action="">
        <?php wp_nonce_field('wpqc_form_action', 'wpqc_nonce'); ?>

        <div class="form-inner">
            <label for="wpqc_text">Enter something:</label><br>
            <div class="input-section">
                <input type="text" name="wpqc_text" id="wpqc_text" required />
                <button type="submit" name="wpqc_submit">Submit</button>
            </div>
        </div>
    </form>

    <?php

    // Append form HTML to output
    $output .= ob_get_clean();

    return $output;
}
add_shortcode('qc_form', 'wpqc_quickcheck_shortcode');
