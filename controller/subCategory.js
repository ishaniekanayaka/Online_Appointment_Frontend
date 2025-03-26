loadCategoryNames();

    function loadCategoryNames(){
        const authToken = localStorage.getItem('authToken')
        $.ajax({
            url: "http://localhost:8080/api/v1/category/getCategoryName",
            method: "GET",
            dataType: "json",
            headers: {"Authorization": `Bearer ${authToken}`},
            success: (resp) => {
                let categoryDropdown = $("#sc_name");
                categoryDropdown.empty().append('<option value="">Select Category Name</option>');
                resp.data.forEach(name => {
                    categoryDropdown.append(`<option value="${name}">${name}</option>`);
                });
            },
            error: (err) => {
                console.error("Error loading customer IDs:", err);
            }
        });
    }

    $("#sc_name").change(function (){
        const authToken = localStorage.getItem('authToken')
        let selectedName = $(this).val();
        if (selectedName) {
            $.ajax({
                url: `http://localhost:8080/api/v1/category/getCategoryByName/${selectedName}`,
                method: "GET",
                dataType: "json",
                headers: {"Authorization": `Bearer ${authToken}`},
                success: function (resp) {
                    if (resp && resp.data) {
                        $("#sc_id").val(resp.data.id);

                    } else {
                        $("#sc_id").val("");

                    }
                },
                error: function (error) {
                    console.error("Error fetching item details:", error);
                }
            });
        } else {
            $("#sc_id").val("");

        }
    });