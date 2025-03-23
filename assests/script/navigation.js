window.addEventListener('load',function (){
    const loadingScreen1 = document.querySelector('.sidebar');
    loadingScreen1.style.display = 'block';

    const loadingScreen2 = document.querySelector('#home');
    loadingScreen2.style.display = 'block';
    $("#dashboardPage").eq(0).css("background","#eee");
    $("#dashboardIcon").eq(0).css("color","black");
    $("#dashboardName").eq(0).css("color","black");

    const loadingScreen3 = document.querySelector('#customer');
    loadingScreen3.style.display = 'none';

    const loadingScreen4 = document.querySelector('#supplier');
    loadingScreen4.style.display = 'none';

    const loadingScreen5 = document.querySelector('#products');
    loadingScreen5.style.display = 'none';

    const loadingScreen6 = document.querySelector('#products-list');
    loadingScreen6.style.display = 'none';

    const loadingScreen7 = document.querySelector('#employee');
    loadingScreen7.style.display = 'none';
    
    const loadingScreen8 = document.querySelector('#stock');
    loadingScreen8.style.display = 'none';

    const loadingScreen9 = document.querySelector('#order');
    loadingScreen9.style.display = 'none';

});

$(document).ready(function (){
    $('#customerPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Customer Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'block';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#customerPage").eq(0).css("background","#eee");
        $("#customerIcon").eq(0).css("color","black");
        $("#customerName").eq(0).css("color","black");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","eee");
        $("#employeeName").eq(0).css("color","eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#dashboardPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Dashboard";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'block';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#eee");
        $("#dashboardIcon").eq(0).css("color","black");
        $("#dashboardName").eq(0).css("color","black");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","eee");
        $("#employeeName").eq(0).css("color","eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#supplierPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Supplier Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'block';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#eee");
        $("#supplierIcon").eq(0).css("color","black");
        $("#supplierName").eq(0).css("color","black");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","eee");
        $("#employeeName").eq(0).css("color","eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#productsPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Products Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'block';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#productsPage").eq(0).css("background","#eee");
        $("#productsIcon").eq(0).css("color","black");
        $("#productsName").eq(0).css("color","black");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","eee");
        $("#employeeName").eq(0).css("color","eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#addProducsListBtn').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Products List Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'block';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#productsPage").eq(0).css("background","#eee");
        $("#productsIcon").eq(0).css("color","black");
        $("#productsName").eq(0).css("color","black");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","eee");
        $("#employeeName").eq(0).css("color","eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#employeePage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Products List Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'block';

        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';
        
        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#eee");
        $("#employeeIcon").eq(0).css("color","black");
        $("#employeeName").eq(0).css("color","black");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");
    });

    $('#stockPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Products List Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';
        
        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'block';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'none';

        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#stockPage").eq(0).css("background","#eee");
        $("#stockIcon").eq(0).css("color","black");
        $("#stockName").eq(0).css("color","black");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","#eee");
        $("#employeeName").eq(0).css("color","#eee");

        $("#orderPage").eq(0).css("background","#892CDC");
        $("#orderIcon").eq(0).css("color","eee");
        $("#orderName").eq(0).css("color","eee");

    });

    $('#orderPage').eq(0).on('click',function (){

        let mainTitle = document.querySelector('.dashboard');
        mainTitle.innerHTML = "Products List Manage Form";

        const loadingScreen1 = document.querySelector('.sidebar');
        loadingScreen1.style.display = 'block';

        const loadingScreen2 = document.querySelector('#home');
        loadingScreen2.style.display = 'none';

        const loadingScreen3 = document.querySelector('#customer');
        loadingScreen3.style.display = 'none';

        const loadingScreen4 = document.querySelector('#supplier');
        loadingScreen4.style.display = 'none';

        const loadingScreen5 = document.querySelector('#products');
        loadingScreen5.style.display = 'none';

        const loadingScreen6 = document.querySelector('#products-list');
        loadingScreen6.style.display = 'none';

        const loadingScreen7 = document.querySelector('#employee');
        loadingScreen7.style.display = 'none';
        
        const loadingScreen8 = document.querySelector('#stock');
        loadingScreen8.style.display = 'none';

        const loadingScreen9 = document.querySelector('#order');
        loadingScreen9.style.display = 'block';

        $("#customerPage").eq(0).css("background","#892CDC");
        $("#customerIcon").eq(0).css("color","#eee");
        $("#customerName").eq(0).css("color","#eee");

        $("#dashboardPage").eq(0).css("background","#892CDC");
        $("#dashboardIcon").eq(0).css("color","#eee");
        $("#dashboardName").eq(0).css("color","#eee");

        $("#supplierPage").eq(0).css("background","#892CDC");
        $("#supplierIcon").eq(0).css("color","#eee");
        $("#supplierName").eq(0).css("color","#eee");

        $("#stockPage").eq(0).css("background","#892CDC");
        $("#stockIcon").eq(0).css("color","eee");
        $("#stockName").eq(0).css("color","eee");

        $("#productsPage").eq(0).css("background","#892CDC");
        $("#productsIcon").eq(0).css("color","#eee");
        $("#productsName").eq(0).css("color","#eee");

        $("#employeePage").eq(0).css("background","#892CDC");
        $("#employeeIcon").eq(0).css("color","#eee");
        $("#employeeName").eq(0).css("color","#eee");

        $("#orderPage").eq(0).css("background","#eee");
        $("#orderIcon").eq(0).css("color","black");
        $("#orderName").eq(0).css("color","black");

    });

});