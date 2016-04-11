'use strict';

function getQueryStringParams(sParam) {

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

var currentContext;
var hostWebContext;
var web;
var list;

function getList(id) {
    clearInfo();
    var lista = hostWebContext.get_web().get_lists().getByTitle("PedidosClientes");
    // var idCliente = $("#idCliente").val();


    var query = new SP.CamlQuery();
    query.set_viewXml("<View Scope='RecursiveAll'><Query><Where><Contains><FieldRef Name='Cliente_x003a_ID' /><Value Type='Text'>" + id + "</Value></Contains></Where></Query></View>");
    list = lista.getItems(query);

    // TODO: Task 2. Submit query results
    currentContext.load(list);
    currentContext.executeQueryAsync(Function.createDelegate(this, onSuccess), Function.createDelegate(this, onFail));
}

function onSuccess() {

    if (list.get_count() != 0) {

        var listEnum = list.getEnumerator();
        var n = 1;
        var total = 0;
        var tabla = $("#TablaPedidos tbody");
        while (listEnum.moveNext()) {
            var html = "<tr>";
            
            var actual = listEnum.get_current();
            var d = actual.get_item("Fecha");
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            html+="<td>"+ actual.get_item("Numero_x0020_pedido")+"</td>";
            html+="<td>"+ day + "-"   +month+ "-" + year+"</td>";
            html+="<td>"+ actual.get_item("Total") +"€ </td>";
            n++;
            tabla.append(html);
        }
        var nombre = actual.get_item("Cliente_x003a_Full_x0020_Name").get_lookupValue();
        $("#Nombre").text(nombre);
        $("#NumeroPedidos").text("Pedidos: " + (n - 1));

        $("#MostrarPedidos").css("display", "block");
        $("#SinPedidos").css("display", "none");

    }
    else {
        $("#MostrarPedidos").css("display", "none");
        $("#SinPedidos").css("display", "block");
    }

}

function onFail() {
    alert("Error");
}

function clearInfo() {
    var t = $("#TablaPedidos>tbody>tr");
    t.remove();
    $("#NumeroPedidos").text("");
    $("#Total").text("");
}

function init() {
    var hostUrl = decodeURIComponent(getQueryStringParams("SPHostUrl"));
    currentContext = new SP.ClientContext.get_current();
    hostWebContext = new SP.AppContextSite(currentContext, hostUrl);
    web = hostWebContext.get_web();

    var id = getQueryStringParams("SPListItemId");
    getList(id);

}

$(document).ready(function () {
    ExecuteOrDelayUntilScriptLoaded(init, "sp.js");

});

