jQuery(document).ready(function($) {

    const input = $('#wpqc_text');
    const countNumber = $('.count-number');
    const submitBtn = $('#qc-submit');
    const messageBox = $('.qc-message');
    const entriesContainer = $('#entries-container');

    submitBtn.addClass('disabled').prop('disabled', true);

    // Function to render entries
    function renderEntries(entries) {
        entriesContainer.empty();
        entries.forEach(entry => {
            const entryEl = $(`
                <div class="qc-entry" data-id="${entry.id}">
                    <span class="qc-content">${entry.content}</span>
                    <span class="qc-date">(${entry.created_at})</span>
                </div>
            `);
            entriesContainer.append(entryEl);
        });
    }

    // Fetch last 5 entries
    function fetchEntries() {
        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpqc_get_entries'
            },
            success: function(entries) {
                renderEntries(entries);
            },
            error: function(xhr) {
                console.log('Fetch entries AJAX error:', xhr.responseText);
            }
        });
    }

    // Initial fetch
    fetchEntries();

    // Live character count + enable/disable + too-short class
    input.on('input', function() {
        let length = $(this).val().length;
        countNumber.text(length);

        if (length < 3) {
            countNumber.addClass('too-short');
            submitBtn.addClass('disabled').prop('disabled', true);

            let remaining = 3 - length;
            messageBox.html(`<span class="qc-warning">You need to add ${remaining} more character${remaining > 1 ? 's' : ''} before you can submit.</span>`);
        } else {
            countNumber.removeClass('too-short');
            submitBtn.removeClass('disabled').prop('disabled', false);
            messageBox.html('');
        }
    });

    // AJAX submit
    $('.quickcheck-form').on('submit', function(e) {
        e.preventDefault();
        let content = input.val();

        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'qc_submit_entry',
                nonce: wpqc_ajax_obj.nonce,
                content: content
            },
            success: function(response) {
                if (response.success) {
                    messageBox.html(`<span class="qc-success">Successfully added entry!</span>`);

                    // Reset field + count
                    input.val('');
                    countNumber.text('0').addClass('too-short');
                    submitBtn.addClass('disabled').prop('disabled', true);

                    // Refresh entries list
                    fetchEntries();
                } else {
                    messageBox.html(`<span class="qc-error">Error: ${response.data.message}</span>`);
                }
            },
            error: function(xhr) {
                messageBox.html(`<span class="qc-error">AJAX error – check console</span>`);
                console.log("AJAX ERROR:", xhr.responseText);
            }
        });
    });

});
