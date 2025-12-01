jQuery(document).ready(function($) {

    const input = $('#wpqc_text');
    const countNumber = $('.count-number');
    const submitBtn = $('#qc-submit');
    const messageBox = $('.qc-message');
    const entriesContainer = $('#entries-container');
    const MIN_CHARS = 3;

    // Disable submit initially
    submitBtn.addClass('disabled').prop('disabled', true);

    // LIVE CHARACTER COUNT
    input.on('input', function() {
        const length = $(this).val().length;
        countNumber.text(length);

        if (length < MIN_CHARS) {
            countNumber.addClass('too-short');
            submitBtn.addClass('disabled').prop('disabled', true);
        } else {
            countNumber.removeClass('too-short');
            submitBtn.removeClass('disabled').prop('disabled', false);
        }
    });

    // SHOW MESSAGE FUNCTION WITH FADE
    function showMessage(message, type = 'success', duration = 3000) {
        if (!message) {
            // Clear any classes and content
            messageBox.removeClass('has-message success warning error').html('');
            return;
        }

        // Set the message HTML
        messageBox.html(`<span class="qc-${type}">${message}</span>`);
        messageBox.addClass('has-message');

        // Add the type-specific class (success, warning, error)
        messageBox.addClass(type);

        // Fade out after duration
        setTimeout(() => {
            messageBox.removeClass('has-message ' + type); // triggers SCSS fade-out
            setTimeout(() => {
                messageBox.html(''); // clear content after transition
            }, 500); // match SCSS transition duration
        }, duration);
    }

    // RENDER ENTRIES WITH FADE-IN
    function renderEntries(entries) {
        entriesContainer.empty();

        entries.forEach((entry, index) => {
            const entryEl = $(`
                <div class="qc-entry" data-id="${entry.id}">
                    <span class="qc-content">${entry.content}</span>
                </div>
            `);

            entriesContainer.append(entryEl);

            // Fade in staggered
            setTimeout(() => {
                entryEl.addClass('visible');
            }, index * 150); // 150ms stagger
        });
    }

    // FETCH LAST 5 ENTRIES
    function fetchEntries() {
        $.ajax({
            url: wpqc_ajax_obj.ajax_url,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'wpqc_get_entries'
            },
            success: function(data) {
                renderEntries(data);
            },
            error: function(xhr) {
                console.log('Error fetching entries:', xhr.responseText);
            }
        });
    }

    // INITIAL FETCH
    fetchEntries();

    // FORM SUBMIT
    $('.quickcheck-form').on('submit', function(e) {
        e.preventDefault();
        const content = input.val().trim();

        if (content.length < MIN_CHARS) {
            const remaining = MIN_CHARS - content.length;
            showMessage(`You need to add ${remaining} more character${remaining > 1 ? 's' : ''} before you can submit.`, 'warning');
            return;
        }

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
                    showMessage('Successfully added entry!', 'success');

                    // Reset input
                    input.val('');
                    countNumber.text('0').addClass('too-short');
                    submitBtn.addClass('disabled').prop('disabled', true);

                    // Fetch entries again to update list
                    fetchEntries();
                } else {
                    showMessage(`Error: ${response.data.message}`, 'error');
                }
            },
            error: function(xhr) {
                showMessage('AJAX error – check console', 'error');
                console.log("AJAX ERROR:", xhr.responseText);
            }
        });
    });

});
