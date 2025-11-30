jQuery(document).ready(function($) {

    const input = $('#wpqc_text');
    const countNumber = $('.count-number');
    const submitBtn = $('.quickcheck-form button[type="submit"]');

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

    // Helper: keep only last 5 entries
    function trimEntries() {
        const entries = $('#entries-container .qc-entry');
        if (entries.length > 5) {
            entries.last().remove();
        }
    }

    // AJAX form submission
    $('.quickcheck-form').on('submit', function(e) {
        e.preventDefault();

        let content = input.val();

        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'qc_submit_entry', // match PHP handler
                nonce: wpqc_ajax_obj.nonce, // match localized nonce
                content: content
            },
            success: function(response) {
                if (response.success) {
                    // Prepend new entry with classes
                    $('#entries-container').prepend(
                        `<div class="qc-entry qc-entry-${response.data.id}">
                            <span class="qc-entry-id">ID ${response.data.id}:</span> 
                            <span class="qc-entry-content">${response.data.content}</span>
                        </div>`
                    );

                    // Trim to last 5 entries
                    trimEntries();

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

    // Optional: load last 5 entries on page load
    function loadEntries() {
        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpqc_get_entries'
            },
            success: function(entries) {
                const container = $('#entries-container');
                container.empty();
                entries.forEach(function(entry) {
                    container.append(
                        `<div class="qc-entry qc-entry-${entry.id}">
                            <span class="qc-entry-id">ID ${entry.id}:</span> 
                            <span class="qc-entry-content">${entry.content}</span>
                        </div>`
                    );
                });
            },
            error: function(xhr, status, error) {
                console.log("AJAX ERROR:", xhr.responseText);
                alert("Could not load entries – check console");
            }
        });
    }

    loadEntries(); // run on page load

});
