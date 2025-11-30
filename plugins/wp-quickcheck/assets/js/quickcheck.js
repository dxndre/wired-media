jQuery(document).ready(function($) {

    const input = $('#wpqc_text');
    const countNumber = $('.count-number');
    const submitBtn = $('#qc-submit'); // match the ID from shortcode

    // Disable submit on load
    submitBtn.addClass('disabled').prop('disabled', true);

    // Live character count + enable/disable + too-short class
    input.on('input', function() {
        let length = $(this).val().length;
        countNumber.text(length);

        if (length < 3) {
            countNumber.addClass('too-short');
            submitBtn.addClass('disabled').prop('disabled', true);
        } else {
            countNumber.removeClass('too-short');
            submitBtn.removeClass('disabled').prop('disabled', false);
        }
    });

    // AJAX form submission
    $('.quickcheck-form').on('submit', function(e) {
        e.preventDefault();

        let content = input.val();

        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'qc_submit_entry', // must match PHP handler
                nonce: wpqc_ajax_obj.nonce, // match localized nonce
                content: content
            },
            success: function(response) {
                if (response.success) {
                    // Append new entry to container
                    $('#entries-container').prepend(
                        `<div class="qc-entry"><strong>ID ${response.data.id}:</strong> ${response.data.content}</div>`
                    );

                    // Reset field + count
                    input.val('');
                    countNumber.text('0').addClass('too-short');

                    // Disable submit
                    submitBtn.addClass('disabled').prop('disabled', true);

                } else {
                    alert("Error: " + response.data.message);
                }
            },
            error: function(xhr, status, error) {
                console.log("AJAX ERROR:", xhr.responseText);
                alert("AJAX error – check console");
            }
        });
    });

    // Optional: load all existing entries
    $('#load-entries').on('click', function() {
        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpqc_get_entries'
            },
            success: function(entries) {
                let container = $('#entries-container');
                container.empty();
                entries.forEach(function(entry) {
                    container.append(
                        `<div class="qc-entry"><strong>ID ${entry.id}:</strong> ${entry.content}</div>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.log("AJAX ERROR:", xhr.responseText);
                alert("Could not load entries – check console");
            }
        });
    });

});
