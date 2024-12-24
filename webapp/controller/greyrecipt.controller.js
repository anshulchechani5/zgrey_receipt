sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageToast, MessageBox, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("zgreyreceipt.controller.greyrecipt", {
            onInit: function () {
                var dt = new Date();
                var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate();
                var oPayloadObject = {
                    "PostingDate": dt1
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                var oPayloadObject1 = {
                    "PostingDate1": dt1
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject1), "oPayloadData1");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel1");
                this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", []);
                this.NewRowEnterFunctionForFirstTable();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "YarnPickReadSpace")
                this.getView().getModel("YarnPickReadSpace").setProperty("/YarnPickReadSpacelist", [])
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                oModel.read("/YarnPickReadSpace", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("YarnPickReadSpace").setProperty("/YarnPickReadSpacelist", oresponse.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oBatchData")
                this.getView().getModel("oBatchData").setProperty("/aData", [])
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                oModel.read("/GreyReceipt", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("oBatchData").setProperty("/aData", oresponse.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oBatchData2")
                this.getView().getModel("oBatchData2").setProperty("/aData2", [])
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                oModel.read("/GreyReceipt", {
                    urlParameters: {
                        "$skip": "5000",
                        "$top": "5000"
                    },
                    success: function (oresponse) {
                        this.getView().getModel("oBatchData2").setProperty("/aData2", oresponse.results)
                    }.bind(this)
                })
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oBatchData1")
                this.getView().getModel("oBatchData1").setProperty("/aData1", [])
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                oModel.read("/GreyStock", {
                    urlParameters: { "$top": "100000" },
                    success: function (oresponse) {
                        this.getView().getModel("oBatchData1").setProperty("/aData1", oresponse.results)
                    }.bind(this)
                })
                var slection = {
                    hide: false,

                }
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(slection), "oCommonModel");

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oPieceLengthModel")
                oModel.read("/piecelength", {
                    urlParameters: { "$top": "5000" },
                    success: function (oresponse) {
                        this.getView().getModel("oPieceLengthModel").setProperty("/aPieceData", oresponse.results)
                    }.bind(this)
                })

                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oPieceCheckModel")
                oModel.read("/PieceChek", {
                    urlParameters: { "$top": "5000" },
                    success: function (oresponse) {
                        this.getView().getModel("oPieceCheckModel").setProperty("/aPieceCheckData", oresponse.results)
                    }.bind(this)
                })


            },
            DeletaTableData: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                if (aSelectedIndex.length > 1) {
                    MessageBox.show("Please Select only 1 Row"
                        , {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                }
                else {
                    var oTableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = oTableModel.getProperty("/aTableData");
                    var aNewArr = [];
                    var sno = [];

                    for (var i = 0; i < aSelectedIndex.length; i++) {

                        aNewArr.push(aTableArr[aSelectedIndex[i]])
                    }

                    aNewArr.map(function (item) {
                        var FaultCode = item.sno;
                        var iIndex = "";
                        aTableArr.map(function (items, index) {
                            if (FaultCode === items.sno) {
                                iIndex = index
                                sno.push(items.sno);
                            }
                        })
                        aTableArr.splice(iIndex, 1);
                    })
                    oTableModel.setProperty("/aTableData", aTableArr)

                    var aNewArr1 = []
                    var table2 = this.getView().getModel("oTableDataModel1")
                    var aTableArr1 = table2.getProperty("/aTableData1")



                    aTableArr1.map(function (items) {

                        if (items.SNO != sno) {
                            aNewArr1.push(items)
                        }

                    })
                    table2.setProperty("/aTableData1", aNewArr1)


                    var oTableModel1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

                    if (oTableModel1.length === 0) {
                        var TableModel = this.getView().getModel("oTableDataModel");
                        var aTableArr = TableModel.getProperty("/aTableData")
                        var obj = {
                            sno: 1,
                            setnumber: "",
                            itemcode: "",
                            descrption: "",
                            movtype: "",
                            po: "",
                            poitem: "",
                            supplier: "",
                            suppliername: "",
                            piecenumber: "",
                            orderqty: "",
                            qtylength: "",
                            UOM: "",
                            pick: "",
                            partychlaan: "",
                            loom: "",
                            grossweight: "",
                            tareweight: "",
                            netweight: "",
                            permtravgweight: "",
                            salesorder: "",
                            solineitem: "",
                            finishroll: "",
                            partybeam: "",

                        }
                        aTableArr.push(obj);
                        TableModel.setProperty("/aFirstTableData", aTableArr);

                    }

                }


            },
            setRowEditable: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                oCommonModel.setProperty("/hide", true);
            },
            NewRowEnterFunctionForFirstTable: function (oEvent) {
                var oTableModel1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

                if (oTableModel1.length === 0) {
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData")
                    var aTablearr = [];
                    var aNewArr = [];
                    // var oTable = sap.ui.core.UIComponent.getRouterFor(this).getView().byId("table1");
                    // var oTable = this.getView().byId("table1");
                    // var iTableLength = oTable.getLength();
                    var oTable = this.getView().byId("table1"); //get the table by ID
                    var iTableLength = oTable.getRows().length; //get the length of items array
                    var RowVisible = iTableLength + 1; //get the length of items array
                    var oObject = {
                        "RowVisible": RowVisible
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oObject), "oRowVisibleModel")
                    this.getView().getModel("oRowVisibleModel").setProperty("/RowVisible", RowVisible)
                    var obj = {
                        sno: 1,
                        setnumber: "",
                        itemcode: "",
                        descrption: "",
                        movtype: "",
                        po: "",
                        poitem: "",
                        supplier: "",
                        suppliername: "",
                        piecenumber: "",
                        orderqty: "",
                        qtylength: "",
                        UOM: "",
                        pick: "",
                        partychlaan: "",
                        loom: "",
                        grossweight: "",
                        tareweight: "",
                        netweight: "",
                        permtravgweight: "",
                        salesorder: "",
                        solineitem: "",
                        finishroll: "",
                        partybeam: "",
                        // permtrporate:"",
                    }
                    aTableArr.push(obj);
                    TableModel.setProperty("/aTableData", aTableArr);
                    if (RowVisible != 1) {
                        // this.CallSecondTableData();
                    }

                }
                else {

                    if (oTableModel1.length < 50) {
                        var oTableModel1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                        var length = oTableModel1.length - 1;
                        var sno = Number(oTableModel1[length].sno) + 1;


                        var TableModel = this.getView().getModel("oTableDataModel");
                        var aTableArr = TableModel.getProperty("/aTableData")
                        var aTablearr = [];
                        var aNewArr = [];
                        // var oTable = sap.ui.core.UIComponent.getRouterFor(this).getView().byId("table1");
                        // var oTable = this.getView().byId("table1");
                        // var iTableLength = oTable.getLength();
                        var oTable = this.getView().byId("table1"); //get the table by ID
                        var iTableLength = oTable.getRows().length; //get the length of items array
                        var RowVisible = iTableLength + 1; //get the length of items array
                        var oObject = {
                            "RowVisible": RowVisible
                        }
                        this.getView().setModel(new sap.ui.model.json.JSONModel(oObject), "oRowVisibleModel")
                        this.getView().getModel("oRowVisibleModel").setProperty("/RowVisible", RowVisible)
                        var obj = {
                            sno: sno.toString(),
                            setnumber: "",
                            itemcode: "",
                            descrption: "",
                            movtype: "",
                            po: "",
                            poitem: "",
                            supplier: "",
                            suppliername: "",
                            piecenumber: "",
                            orderqty: "",
                            qtylength: "",
                            UOM: "",
                            pick: "",
                            partychlaan: "",
                            loom: "",
                            grossweight: "",
                            tareweight: "",
                            netweight: "",
                            permtravgweight: "",
                            salesorder: "",
                            solineitem: "",
                            finishroll: "",
                            partybeam: "",
                            // permtrporate:"",
                        }
                        aTableArr.push(obj);
                        TableModel.setProperty("/aTableData", aTableArr);
                        if (RowVisible != 1) {
                            // this.CallSecondTableData();
                        }

                    }



                }

            },
            onRead: function (oEvent) {
                var idchallan = this.getView().byId("idchallan").getValue();
                var supplier = this.getView().byId("supplier").getValue();

                if (idchallan === "") {
                    MessageBox.show("Please Enter Party challan ", {
                        title: "Warning!!!!!!",
                        icon: MessageBox.Icon.ERROR
                    });

                }
                else if (supplier === "") {
                    MessageBox.show("Please Enter Party ", {
                        title: "Warning!!!!!!",
                        icon: MessageBox.Icon.ERROR
                    });
                }
                else {


                    var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                    var data = this.getView().getModel("oBatchData").getProperty("/aData");
                    var data1 = this.getView().getModel("oBatchData2").getProperty("/aData2")
                    var aNewArr = [];
                    var BatchVar11 = oContext.setnumber;
                    var BatchVar = BatchVar11.toUpperCase();
                    data.map(function (items) {
                        if (items.Batch === BatchVar && supplier === items.Supplier) {
                            aNewArr.push(items);
                        }
                    })
                    if (aNewArr.length === 0) {
                        data1.map(function (items) {
                            if (items.Batch === BatchVar && supplier === items.Supplier) {
                                aNewArr.push(items);
                            }
                        })
                    }


                    if (aNewArr.length === 0) {
                        MessageBox.show("Please  Enter Beam No of Same Party", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }
                    else {


                        var date = new Date();

                        var newdate = date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate();

                        if (newdate.length === 10) {
                            var yyyy = newdate.slice(0, 4);
                            var mm = newdate.slice(5, 7);
                            var dd = newdate.slice(8, 10);
                            var dte8 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (newdate.length === 9) {
                            var yyyy = newdate.slice(0, 4);
                            var mm = newdate.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = newdate.slice(5, 6);
                                mm = "0" + mm;
                                var dd = newdate.slice(7, 9);
                            }
                            else {
                                var mm = newdate.slice(5, 7);
                                var dd = newdate.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte8 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (newdate.length === 8) {
                            var yyyy = newdate.slice(0, 4);
                            var mm = newdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd = newdate.slice(7, 8);
                            dd = "0" + dd;
                            var dte8 = yyyy + '-' + mm + '-' + dd;
                        }

                        var newdate = dte8;

                        var dateObj = new Date();

                        // Subtract six day from current time					
                        dateObj.setDate(dateObj.getDate() - 5);

                        var backdate = dateObj.getFullYear() + '-' + Number(dateObj.getMonth() + 1) + '-' + dateObj.getDate();

                        if (backdate.length === 10) {
                            var yyyy = backdate.slice(0, 4);
                            var mm = backdate.slice(5, 7);
                            var dd = backdate.slice(8, 10);
                            var dte = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate.length === 9) {
                            var yyyy = backdate.slice(0, 4);
                            var mm = backdate.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = backdate.slice(5, 6);
                                mm = "0" + mm;
                                var dd = backdate.slice(7, 9);
                            }
                            else {
                                var mm = backdate.slice(5, 7);
                                var dd = backdate.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate.length === 8) {
                            var yyyy = backdate.slice(0, 4);
                            var mm = backdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate.slice(7, 8);
                            dd = "0" + dd;
                            var dte = yyyy + '-' + mm + '-' + dd;
                        }

                        var backdate = dte;

                        var dateObj1 = new Date();

                        // Subtract four day from current time					
                        dateObj1.setDate(dateObj1.getDate() - 4);

                        var backdate1 = dateObj1.getFullYear() + '-' + Number(dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();

                        if (backdate1.length === 10) {
                            var yyyy = backdate1.slice(0, 4);
                            var mm = backdate1.slice(5, 7);
                            var dd = backdate1.slice(8, 10);
                            var dte1 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate1.length === 9) {
                            var yyyy = backdate1.slice(0, 4);
                            var mm = backdate1.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = backdate1.slice(5, 6);
                                mm = "0" + mm;
                                var dd = backdate1.slice(7, 9);
                            }
                            else {
                                var mm = backdate1.slice(5, 7);
                                var dd = backdate1.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte1 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate1.length === 8) {
                            var yyyy = backdate1.slice(0, 4);
                            var mm = backdate1.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate1.slice(7, 8);
                            dd = "0" + dd;
                            var dte1 = yyyy + '-' + mm + '-' + dd;
                        }

                        var backdate1 = dte1;

                        var dateObj2 = new Date();

                        // Subtract three day from current time					
                        dateObj2.setDate(dateObj2.getDate() - 3);

                        var backdate2 = dateObj2.getFullYear() + '-' + Number(dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();

                        if (backdate2.length === 10) {
                            var yyyy = backdate2.slice(0, 4);
                            var mm = backdate2.slice(5, 7);
                            var dd = backdate2.slice(8, 10);
                            var dte2 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate2.length === 9) {
                            var yyyy = backdate2.slice(0, 4);
                            var mm = backdate2.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = backdate2.slice(5, 6);
                                mm = "0" + mm;
                                var dd = backdate2.slice(7, 9);
                            }
                            else {
                                var mm = backdate2.slice(5, 7);
                                var dd = backdate2.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte2 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate2.length === 8) {
                            var yyyy = backdate2.slice(0, 4);
                            var mm = backdate2.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate2.slice(7, 8);
                            dd = "0" + dd;
                            var dte2 = yyyy + '-' + mm + '-' + dd;
                        }

                        var backdate2 = dte2;

                        var dateObj3 = new Date();

                        // Subtract two day from current time					
                        dateObj3.setDate(dateObj3.getDate() - 2);

                        var backdate3 = dateObj3.getFullYear() + '-' + Number(dateObj3.getMonth() + 1) + '-' + dateObj3.getDate();

                        if (backdate3.length === 10) {
                            var yyyy = backdate3.slice(0, 4);
                            var mm = backdate3.slice(5, 7);
                            var dd = backdate3.slice(8, 10);
                            var dte3 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate3.length === 9) {
                            var yyyy = backdate3.slice(0, 4);
                            var mm = backdate3.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = backdate3.slice(5, 6);
                                mm = "0" + mm;
                                var dd = backdate3.slice(7, 9);
                            }
                            else {
                                var mm = backdate3.slice(5, 7);
                                var dd = backdate3.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte3 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate3.length === 8) {
                            var yyyy = backdate3.slice(0, 4);
                            var mm = backdate3.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate3.slice(7, 8);
                            dd = "0" + dd;
                            var dte3 = yyyy + '-' + mm + '-' + dd;
                        }

                        var backdate3 = dte3;

                        var dateObj4 = new Date();

                        // Subtract one day from current time					
                        dateObj4.setDate(dateObj4.getDate() - 1);

                        var backdate4 = dateObj4.getFullYear() + '-' + Number(dateObj4.getMonth() + 1) + '-' + dateObj4.getDate();

                        if (backdate4.length === 10) {
                            var yyyy = backdate4.slice(0, 4);
                            var mm = backdate4.slice(5, 7);
                            var dd = backdate4.slice(8, 10);
                            var dte4 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate4.length === 9) {
                            var yyyy = backdate4.slice(0, 4);
                            var mm = backdate4.slice(5, 7);
                            if (mm.slice(1, 2) === '-') {
                                var mm = backdate4.slice(5, 6);
                                mm = "0" + mm;
                                var dd = backdate4.slice(7, 9);
                            }
                            else {
                                var mm = backdate4.slice(5, 7);
                                var dd = backdate4.slice(8, 9);
                                dd = "0" + dd;
                            }
                            var dte4 = yyyy + '-' + mm + '-' + dd;
                        }
                        else if (backdate4.length === 8) {
                            var yyyy = backdate4.slice(0, 4);
                            var mm = backdate4.slice(5, 6);
                            mm = "0" + mm;
                            var dd = backdate4.slice(7, 8);
                            dd = "0" + dd;
                            var dte4 = yyyy + '-' + mm + '-' + dd;
                        }

                        var backdate4 = dte4;





                        var table1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

                        if (table1.length > 1) {

                            var add = [];
                            for (var i = 65; i <= 90; i++) {
                                add.push(String.fromCharCode(i));
                            }

                            var a = [];

                            table1.map(function (items) {
                                if (items.setnumber === BatchVar && items.finishroll != "") {
                                    a.push(items);
                                }
                            })
                            if (a.length === 0) {
                                var supplier = String(table1[0].supplier);
                                if (supplier === aNewArr[0].Supplier) {
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = aNewArr[0].FINISHROLL
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().grey_recpit = aNewArr[0].grey_recpit
                                    // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
                                }
                                else {
                                    MessageBox.error("Please Enter Same Supplier Set Number");
                                }
                            }
                            else {
                                var len = (a.length) - 1;
                                var k = a[len].finishroll;
                                var l = k.length;
                                var p = k.length - 1;
                                var c = k.slice(p, l);
                                var op = k.slice(0, p);
                                var jp = "";
                                for (var k = 0; k < add.length; k++) {
                                    if (c === add[k]) {
                                        jp = add[k + 1];
                                    }
                                }
                                var finishroll = op + jp;


                                var supplier = String(table1[0].supplier);
                                if (supplier === aNewArr[0].Supplier) {
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = finishroll
                                    oEvent.getSource().getBindingContext("oTableDataModel").getObject().grey_recpit = aNewArr[0].grey_recpit
                                    // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
                                }
                                else {
                                    MessageBox.error("Please Enter Same Supplier Set Number");
                                }
                            }

                        }
                        else {
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = aNewArr[0].FINISHROLL
                            oEvent.getSource().getBindingContext("oTableDataModel").getObject().grey_recpit = aNewArr[0].grey_recpit
                            // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
                        }
                    }



                }

            },
            // onRead: function (oEvent) {
            //     var idchallan = this.getView().byId("idchallan").getValue();
            //     var supplier = this.getView().byId("supplier").getValue();

            //     if (idchallan === "") {
            //         MessageBox.show("Please Enter Party challan ", {
            //             title: "Warning!!!!!!",
            //             icon: MessageBox.Icon.ERROR
            //         });

            //     }
            //     else if(supplier === ""){
            //         MessageBox.show("Please Enter Party ", {
            //             title: "Warning!!!!!!",
            //             icon: MessageBox.Icon.ERROR
            //         });
            //     }
            //     else 
            //     {


            //         var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
            //         var data = this.getView().getModel("oBatchData").getProperty("/aData")
            //         var aNewArr = [];
            //         var BatchVar11 = oContext.setnumber;
            //         var BatchVar = BatchVar11.toUpperCase();
            //         data.map(function (items) {
            //             if (items.Batch === BatchVar &&  supplier === items.Supplier ) {
            //                 aNewArr.push(items);
            //             }
            //         })

            //         if(aNewArr.length === 0){
            //             MessageBox.show("Please  Enter Beam No of Same Party", {
            //                 title: "Warning!!!!!!",
            //                 icon: MessageBox.Icon.ERROR
            //             });
            //         }
            //         else{


            //             var date = new Date();

            //             var newdate =  date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate();

            //             if (newdate.length === 10) {
            //                 var yyyy = newdate.slice(0, 4);
            //                 var mm = newdate.slice(5, 7);
            //                 var dd = newdate.slice(8, 10);
            //                 var dte8 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (newdate.length === 9) {
            //                 var yyyy = newdate.slice(0, 4);
            //                 var mm = newdate.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = newdate.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =newdate.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = newdate.slice(5,7);
            //                     var dd =newdate.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte8 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (newdate.length === 8) {
            //                 var yyyy = newdate.slice(0, 4);
            //                 var mm = newdate.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = newdate.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte8 =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var newdate = dte8;

            //             var dateObj = new Date();

            //             // Subtract six day from current time					
            //             dateObj.setDate(dateObj.getDate() - 5);

            //             var backdate =  dateObj.getFullYear() + '-' + Number(dateObj.getMonth() + 1) + '-' + dateObj.getDate();

            //             if (backdate.length === 10) {
            //                 var yyyy = backdate.slice(0, 4);
            //                 var mm = backdate.slice(5, 7);
            //                 var dd = backdate.slice(8, 10);
            //                 var dte =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate.length === 9) {
            //                 var yyyy = backdate.slice(0, 4);
            //                 var mm = backdate.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = backdate.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =backdate.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = backdate.slice(5,7);
            //                     var dd =backdate.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate.length === 8) {
            //                 var yyyy = backdate.slice(0, 4);
            //                 var mm = backdate.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = backdate.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var backdate = dte;

            //             var dateObj1 = new Date();

            //             // Subtract four day from current time					
            //             dateObj1.setDate(dateObj1.getDate() - 4);

            //             var backdate1 =  dateObj1.getFullYear() + '-' + Number(dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();

            //             if (backdate1.length === 10) {
            //                 var yyyy = backdate1.slice(0, 4);
            //                 var mm = backdate1.slice(5, 7);
            //                 var dd = backdate1.slice(8, 10);
            //                 var dte1 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate1.length === 9) {
            //                 var yyyy = backdate1.slice(0, 4);
            //                 var mm = backdate1.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = backdate1.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =backdate1.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = backdate1.slice(5,7);
            //                     var dd =backdate1.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte1 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate1.length === 8) {
            //                 var yyyy = backdate1.slice(0, 4);
            //                 var mm = backdate1.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = backdate1.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte1 =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var backdate1 = dte1;

            //             var dateObj2 = new Date();

            //             // Subtract three day from current time					
            //             dateObj2.setDate(dateObj2.getDate() - 3);

            //             var backdate2 =  dateObj2.getFullYear() + '-' + Number(dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();

            //             if (backdate2.length === 10) {
            //                 var yyyy = backdate2.slice(0, 4);
            //                 var mm = backdate2.slice(5, 7);
            //                 var dd = backdate2.slice(8, 10);
            //                 var dte2 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate2.length === 9) {
            //                 var yyyy = backdate2.slice(0, 4);
            //                 var mm = backdate2.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = backdate2.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =backdate2.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = backdate2.slice(5,7);
            //                     var dd =backdate2.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte2 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate2.length === 8) {
            //                 var yyyy = backdate2.slice(0, 4);
            //                 var mm = backdate2.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = backdate2.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte2 =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var backdate2 = dte2;

            //             var dateObj3 = new Date();

            //             // Subtract two day from current time					
            //             dateObj3.setDate(dateObj3.getDate() - 2);

            //             var backdate3 =  dateObj3.getFullYear() + '-' + Number(dateObj3.getMonth() + 1) + '-' + dateObj3.getDate();

            //             if (backdate3.length === 10) {
            //                 var yyyy = backdate3.slice(0, 4);
            //                 var mm = backdate3.slice(5, 7);
            //                 var dd = backdate3.slice(8, 10);
            //                 var dte3 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate3.length === 9) {
            //                 var yyyy = backdate3.slice(0, 4);
            //                 var mm = backdate3.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = backdate3.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =backdate3.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = backdate3.slice(5,7);
            //                     var dd =backdate3.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte3 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate3.length === 8) {
            //                 var yyyy = backdate3.slice(0, 4);
            //                 var mm = backdate3.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = backdate3.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte3 =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var backdate3 = dte3;

            //             var dateObj4 = new Date();

            //             // Subtract one day from current time					
            //             dateObj4.setDate(dateObj4.getDate() - 1);

            //             var backdate4 =  dateObj4.getFullYear() + '-' + Number(dateObj4.getMonth() + 1) + '-' + dateObj4.getDate();

            //             if (backdate4.length === 10) {
            //                 var yyyy = backdate4.slice(0, 4);
            //                 var mm = backdate4.slice(5, 7);
            //                 var dd = backdate4.slice(8, 10);
            //                 var dte4 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate4.length === 9) {
            //                 var yyyy = backdate4.slice(0, 4);
            //                 var mm = backdate4.slice(5,7);
            //                 if(mm.slice(1,2) === '-'){
            //                     var mm = backdate4.slice(5, 6);
            //                     mm = "0" + mm;
            //                     var dd =backdate4.slice(7, 9);
            //                 }
            //                 else{
            //                     var mm = backdate4.slice(5,7);
            //                     var dd =backdate4.slice(8, 9);
            //                     dd = "0" + dd;
            //                 }
            //                 var dte4 =yyyy+'-'+mm+'-'+dd;
            //             }
            //             else if (backdate4.length === 8) {
            //                 var yyyy = backdate4.slice(0, 4);
            //                 var mm = backdate4.slice(5, 6);
            //                 mm = "0" + mm;
            //                 var dd = backdate4.slice(7, 8);
            //                 dd = "0" + dd;
            //                 var dte4 =yyyy+'-'+mm+'-'+dd;
            //             }

            //             var backdate4 = dte4;





            //             var table1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");

            //             if (table1.length > 1) {

            //                 var add =[];
            //                 for (var i = 65; i <= 90; i++) {
            //                  add.push(String.fromCharCode(i));
            //                 }

            //                 var a=[];

            //                 table1.map(function (items) {
            //                     if (items.setnumber === BatchVar && items.finishroll != "") {
            //                         a.push(items);
            //                      }
            //                 })
            //                 if(a.length === 0){
            //                     var supplier = String(table1[0].supplier);
            //                     if (supplier === aNewArr[0].Supplier) {
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = aNewArr[0].FINISHROLL
            //                         // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
            //                     }
            //                     else {
            //                         MessageBox.error("Please Enter Same Supplier Set Number");
            //                     }
            //                 }
            //                 else{
            //                     var len = (a.length) - 1;
            //                     var k = a[len].finishroll;
            //                     var l = k.length;
            //                     var p = k.length - 1;
            //                     var c = k.slice(p,l);
            //                     var op = k.slice(0,p);
            //                     var jp = "";
            //                     for(var k = 0; k<add.length;k++){
            //                         if(c === add[k]){
            //                            jp = add[k + 1];
            //                         }
            //                     }
            //                     var finishroll =  op + jp; 


            //                     var supplier = String(table1[0].supplier);
            //                     if (supplier === aNewArr[0].Supplier) {
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
            //                         oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = finishroll
            //                         // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
            //                     }
            //                     else {
            //                         MessageBox.error("Please Enter Same Supplier Set Number");
            //                     }
            //                 }

            //             }
            //             else {
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().movtype = "101"
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().partychlaan = idchallan
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().po = aNewArr[0].PurchaseOrder
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem = aNewArr[0].PurchaseOrderItem
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode = aNewArr[0].Material
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().descrption = aNewArr[0].ProductDescription
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier = aNewArr[0].Supplier
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().suppliername = aNewArr[0].SupplierName
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().salesorder = aNewArr[0].SalesOrder
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().solineitem = aNewArr[0].SalesOrderItem
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().UOM = aNewArr[0].BaseUnit
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty = aNewArr[0].OrderQuantity
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().beamlength = aNewArr[0].BeamLenght
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom = aNewArr[0].loom
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().pick = aNewArr[0].pick
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().partybeam = aNewArr[0].partybeam
            //                 oEvent.getSource().getBindingContext("oTableDataModel").getObject().finishroll = aNewArr[0].FINISHROLL
            //                 // oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtrporate = aNewArr[0].partybeam
            //             }
            //         }



            //     }

            // },
            getAvgWt: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var avgWeight = oContext.netweight / oContext.qtylength
                oEvent.getSource().getBindingContext("oTableDataModel").getObject().permtravgweight = parseFloat(avgWeight).toFixed(3);
            },
            onpcnocheck11: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var pieceno = oContext.piecenumber;
                var setnumber = oContext.setnumber;
                var itemcode = oContext.itemcode;
                var oModel = this.getView().getModel();
                var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
                var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);
                var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);
                oModel.read("/PieceChek", {
                    urlParameters: { "$top": "100000" },
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {

                        }
                        else if (oresponse.results.length > 0) {
                            MessageBox.error("Entered Piece already received against the set")
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusyDialog.close();
                        MessageBox.show("Entered Piece already received against the set", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }

                })




            },



            CallSecondTableData_old: function (oEvent) {

                var oModel = this.getView().getModel();
                var oTableModel1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var QuantityVar = oEvent.getSource().getBindingContext("oTableDataModel").getObject().qtylength;
                var sno = oEvent.getSource().getBindingContext("oTableDataModel").getObject().sno;
                var pclength = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Length;
                var orderqty = oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty;
                var supplier = oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier;
                var setnumber = oEvent.getSource().getBindingContext("oTableDataModel").getObject().setnumber;
                var oTableModel2 = this.getView().getModel("oTableDataModel1")
                var aTableArr = oTableModel2.getProperty("/aTableData1");
                var po = oEvent.getSource().getBindingContext("oTableDataModel").getObject().po;
                var poitem = oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem;
                var oFilter = new sap.ui.model.Filter("PurchaseOrder", "EQ", po);
                var oFilter1 = new sap.ui.model.Filter("PurchaseOrderItem", "EQ", poitem);
                var var1 = oTableModel1.length;
                var var2 = var1 - 1;
                var looomno = oTableModel1[var2].loom;

                if (pclength > orderqty) {
                    return MessageBox.error("Pc length Quantity can not be larger than Order Quantity");
                }


                if (looomno != "") {
                    var QuantVar = oTableModel1[var2].qtylength;
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();
                    if (QuantityVar != "") {
                        if (QuantVar === "") {
                            oBusyDialog.close();
                            MessageBox.error("Wrong Input...... You have to input in next line of first table");
                        }
                        else {
                            oModel.read("/GreyComponent", {
                                urlParameters: { "$top": "100000" },
                                filters: [oFilter, oFilter1],
                                success: function (oresponse) {
                                    if (oresponse.results.length === 0) {
                                        MessageBox.show("Data Not Found", {
                                            title: "Warning!!!!!!",
                                            icon: MessageBox.Icon.ERROR
                                        });
                                    }
                                    else {
                                        var or = Number(orderqty);
                                        var pcl = Number(pclength);
                                        var mat;
                                        oresponse.results.map(function (items) {
                                            mat = items.Material;
                                            var a = Number(items.RequiredQuantity);
                                            var b = a / or;
                                            var c = b * pcl;
                                            c = parseFloat(c).toFixed(3)
                                            var obj = {
                                                "SNO": sno,
                                                "itemcode": items.Material,
                                                "descrption": items.ProductDescription,
                                                "qtytlength": items.RequiredQuantity,
                                                "remainingqty": items.RemainingQty,
                                                "reqqty": c,
                                                "targetqty": c,
                                                "setnumber": items.Batch,
                                                "movtype": "543",
                                                "supplier": supplier,
                                                "po": items.PurchaseOrder,
                                                "poitem": items.PurchaseOrderItem,
                                                "salesoder": items.SalesOrder,
                                                "Solineitem": items.SalesOrderItem,
                                                "batch": setnumber,
                                                "LengthFirst": pclength,
                                            }
                                            aTableArr.push(obj);
                                        })
                                        this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", aTableArr);
                                        oBusyDialog.close();
                                        this.NewRowEnterFunctionForFirstTable();
                                    }
                                }.bind(this),
                                error: function (error) {
                                    oBusyDialog.close();
                                    MessageBox.show("Data Not Found", {
                                        title: "Warning!!!!!!",
                                        icon: MessageBox.Icon.ERROR
                                    });
                                }

                            })
                        }
                    }
                    else {
                        oBusyDialog.close();
                        MessageBox.show("Please Enter Quantity First", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }
                }
                else {
                    MessageBox.show(" Please Enter Loom No. ", {
                        title: "Warning!!!!!!",
                        icon: MessageBox.Icon.ERROR
                    });
                }


            },

            CallSecondTableData: function (oEvent) {
                var oModel = this.getView().getModel();
                var oTableModel1 = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                var QuantityVar = oEvent.getSource().getBindingContext("oTableDataModel").getObject().qtylength;
                var sno = oEvent.getSource().getBindingContext("oTableDataModel").getObject().sno;
                var pclength = oEvent.getSource().getBindingContext("oTableDataModel").getObject().Length;
                var orderqty = oEvent.getSource().getBindingContext("oTableDataModel").getObject().orderqty;
                var supplier = oEvent.getSource().getBindingContext("oTableDataModel").getObject().supplier;
                var setnumber = oEvent.getSource().getBindingContext("oTableDataModel").getObject().setnumber;
                var itemcode = oEvent.getSource().getBindingContext("oTableDataModel").getObject().itemcode;
                var oTableModel2 = this.getView().getModel("oTableDataModel1")
                var aTableArr = oTableModel2.getProperty("/aTableData1");
                var po = oEvent.getSource().getBindingContext("oTableDataModel").getObject().po;
                var poitem = oEvent.getSource().getBindingContext("oTableDataModel").getObject().poitem;
                var oFilter = new sap.ui.model.Filter("PurchaseOrder", "EQ", po);
                var oFilter1 = new sap.ui.model.Filter("PurchaseOrderItem", "EQ", poitem);
                var var1 = oTableModel1.length;
                var var2 = var1 - 1;
                // var looomno = oTableModel1[var2].loom;

                var looomno = oEvent.getSource().getBindingContext("oTableDataModel").getObject().loom;

                if (parseFloat(pclength) > parseFloat(orderqty)) {
                    return MessageBox.error("Pc length Quantity can not be larger than Order Quantity");
                }

                if (pclength === null || pclength === "") {
                    return MessageBox.error("Quantity can't be Empty");
                }


                if (looomno != "") {

                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Fetching Data",
                        text: "Please wait",
                    });
                    oBusyDialog.open();
                    oModel.read("/GreyComponent", {
                        urlParameters: { "$top": "100000" },
                        filters: [oFilter, oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                MessageBox.show("Data Not Found", {
                                    title: "Warning!!!!!!",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                var or = Number(orderqty);
                                var pcl = Number(pclength);
                                var mat;
                                oresponse.results.map(function (items) {
                                    mat = items.Material;
                                    var a = Number(items.RequiredQuantity);
                                    var b = a / or;
                                    var c = b * pcl;

                                    // data changed by div
                                    var actualConsumptionQuantity = (pcl * 1.05); // before it was 1.06

                                    // if previous requirement then remove actualconsumptionquantity

                                    // var d = ( c * 6 ) / 100; // changed from 7 to 6                                    
                                    // var e = c + d;
                                    var e = actualConsumptionQuantity;

                                    e = parseFloat(e).toFixed(3)
                                    c = parseFloat(c).toFixed(3)
                                    var f = items.Material.slice(0, 2);                                    


                                if (f === "BD") { 
                                    var g = e ;
                                }
                                else { 
                                    var g = c ;
                                 }
                                    var obj = {
                                        "SNO": sno,
                                        "itemcode": items.Material,
                                        "descrption": items.ProductDescription,
                                        "qtytlength": items.RequiredQuantity,
                                        "remainingqty": items.RemainingQty,                                       
                                        "reqqty": g,
                                        "targetqty": c,
                                        "setnumber": items.Batch,
                                        "movtype": "543",
                                        "supplier": supplier,
                                        "po": items.PurchaseOrder,
                                        "poitem": items.PurchaseOrderItem,
                                        "salesoder": items.SalesOrder,
                                        "Solineitem": items.SalesOrderItem,
                                        "batch": setnumber,
                                        "itemcodefirst": itemcode,
                                        "LengthFirst": pclength
                                    }
                                    aTableArr.push(obj);
                                })
                                this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", aTableArr);
                                oBusyDialog.close();
                                this.NewRowEnterFunctionForFirstTable();
                            }
                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show("Data Not Found", {
                                title: "Warning!!!!!!",
                                icon: MessageBox.Icon.ERROR
                            });
                        }

                    })

                }
                else {
                    MessageBox.show(" Please Enter Loom No. ", {
                        title: "Warning!!!!!!",
                        icon: MessageBox.Icon.ERROR
                    });
                }


            },

            onValueHelpRequest: function (oEvent) {
                var oView = this.getView();
                this.oSource = oEvent.getSource();
                this.sPath = oEvent.getSource().getBindingContext('oTableDataModel1').getPath();
                this.sPath1 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().itemcode;
                this.sPath2 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().salesoder;
                this.sPath3 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().Solineitem;
                this.sPath4 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().supplier;
                this.sPath5 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().batch;
                this.sPath6 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().itemcodefirst;
                this.sPath7 = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().targetqty;
                this.LengthFirst = oEvent.getSource().getBindingContext('oTableDataModel1').getObject().LengthFirst
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN")

                if (this.sPath1.slice(0, 1) === 'Y') {
                    var oFilter = new sap.ui.model.Filter("Material", "EQ", this.sPath1);
                    var oFilter1 = new sap.ui.model.Filter("SDDocument", "EQ", this.sPath2);
                    var oFilter2 = new sap.ui.model.Filter("SDDocumentItem", "EQ", this.sPath3);
                    var oFilter3 = new sap.ui.model.Filter("Supplier", "EQ", this.sPath4);
                    // var oFilter9 = new sap.ui.model.Filter("Yarn", "EQ", this.sPath1);
                    // var oFilter8 = new sap.ui.model.Filter("Fabric", "EQ",  this.sPath6);
                    oModel.read("/GreyStock", {
                        filters: [oFilter, oFilter1, oFilter2, oFilter3],
                        urlParameters: { "$top": "5000" },
                        success: function (oresponse) {
                            var sKey = this.oSource.getCustomData()[0].getKey();
                            if (!this._pValueHelpDialog) {
                                this._pValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "zgreyreceipt.fragments.VendorValueHelp",
                                    controller: this
                                }).then(function (oValueHelpDialog) {
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                            this._pValueHelpDialog.then(function (oValueHelpDialog) {
                                // this._configValueHelpDialog(this.oSource);
                                var aNewArr = [];
                                var sInput = this.sPath1
                                var so = this.sPath2
                                var soitem = this.sPath3
                                var supplier = this.sPath4
                                var batch = this.sPath5
                                var a = sInput.slice(0, 1);
                                if (a === "Y") {
                                    var oModel = this.getView().getModel('oBatchData1').getProperty("/aData1");
                                    oresponse.results.map(function (items) {
                                        if (items.Material === sInput && items.SDDocument === so && items.SDDocumentItem === soitem && items.Supplier === supplier) {
                                            aNewArr.push(items)
                                        }
                                    })
                                }
                                else {
                                    var oModel = this.getView().getModel('oBatchData1').getProperty("/aData1");
                                    oresponse.results.map(function (items) {
                                        if (items.Material === sInput && items.SDDocument === so && items.SDDocumentItem === soitem && items.Supplier === supplier && items.Batch === batch) {
                                            aNewArr.push(items)
                                        }
                                    })
                                }

                                this.getView().setModel(new sap.ui.model.json.JSONModel(), "BatchData")
                                this.getView().getModel("BatchData").setProperty("/aData", aNewArr)
                                if (sKey === 'VC') {
                                    var oTemplate = new sap.m.StandardListItem({
                                        title: "{BatchData>Material}",
                                        description: "{BatchData>Batch}",
                                        info: "{BatchData>BatchF4QtY}" + " " + "{BatchData>lotno}",
                                        Millname: "{BatchData>MillName}",
                                        lotno: "{BatchData>lotno}",
                                        type: "Active"
                                    });
                                    oValueHelpDialog.bindAggregation("items", {
                                        path: 'BatchData>/aData',
                                        template: oTemplate
                                    });
                                    oValueHelpDialog.setTitle("Select Batch");
                                }

                                oValueHelpDialog.open();
                            }.bind(this));

                        }.bind(this)
                    })

                }
                else {
                    var oFilter = new sap.ui.model.Filter("Material", "EQ", this.sPath1);
                    var oFilter1 = new sap.ui.model.Filter("SDDocument", "EQ", this.sPath2);
                    var oFilter2 = new sap.ui.model.Filter("SDDocumentItem", "EQ", this.sPath3);
                    var oFilter3 = new sap.ui.model.Filter("Batch", "EQ", this.sPath5);
                    oModel.read("/GreyStock", {
                        filters: [oFilter, oFilter1, oFilter2, oFilter3],
                        urlParameters: { "$top": "5000" },
                        success: function (oresponse) {
                            var sKey = this.oSource.getCustomData()[0].getKey();
                            if (!this._pValueHelpDialog) {
                                this._pValueHelpDialog = Fragment.load({
                                    id: oView.getId(),
                                    name: "zgreyreceipt.fragments.VendorValueHelp",
                                    controller: this
                                }).then(function (oValueHelpDialog) {
                                    oView.addDependent(oValueHelpDialog);
                                    return oValueHelpDialog;
                                });
                            }
                            this._pValueHelpDialog.then(function (oValueHelpDialog) {
                                // this._configValueHelpDialog(this.oSource);
                                var aNewArr = [];
                                var sInput = this.sPath1
                                var so = this.sPath2
                                var soitem = this.sPath3
                                var supplier = this.sPath4
                                var batch = this.sPath5
                                var a = sInput.slice(0, 1);
                                if (a === "Y") {
                                    var oModel = this.getView().getModel('oBatchData1').getProperty("/aData1");
                                    oresponse.results.map(function (items) {
                                        if (items.Material === sInput && items.SDDocument === so && items.SDDocumentItem === soitem && items.Supplier === supplier) {
                                            aNewArr.push(items)
                                            // if(Number(items.Stock) === Number(stock) ){
                                            //     aNewArr.push(items)
                                            // }
                                            // else if(Number(stock) > Number(items.Stock)){
                                            //     aNewArr.push(items)
                                            // }

                                        }
                                    })
                                }
                                else {
                                    var oModel = this.getView().getModel('oBatchData1').getProperty("/aData1");
                                    oresponse.results.map(function (items) {
                                        if (items.Material === sInput && items.SDDocument === so && items.SDDocumentItem === soitem && items.Supplier === supplier && items.Batch === batch) {
                                            aNewArr.push(items)
                                            // if(Number(items.Stock) === Number(stock) ){
                                            //     aNewArr.push(items)
                                            // }
                                            // else if(Number(stock) > Number(items.Stock)){
                                            //     aNewArr.push(items)
                                            // }

                                        }
                                    })
                                }

                                this.getView().setModel(new sap.ui.model.json.JSONModel(), "BatchData")
                                this.getView().getModel("BatchData").setProperty("/aData", aNewArr)
                                if (sKey === 'VC') {
                                    var oTemplate = new sap.m.StandardListItem({
                                        title: "{BatchData>Material}",
                                        description: "{BatchData>Batch}",
                                        info: "{BatchData>BatchF4QtY}" + " " + "{BatchData>lotno}",
                                        Millname: "{BatchData>MillName}",
                                        lotno: "{BatchData>lotno}",
                                        type: "Active"
                                    });
                                    oValueHelpDialog.bindAggregation("items", {
                                        path: 'BatchData>/aData',
                                        template: oTemplate
                                    });
                                    oValueHelpDialog.setTitle("Select Batch");
                                }

                                oValueHelpDialog.open();
                            }.bind(this));
                        }.bind(this)
                    })
                }


            },
            _configValueHelpDialog: function (oSource) {
                var sInputValue = oSource.getBindingContext("oTableDataModel1").getObject().itemcode,
                    oModel = this.getView().getModel('oBatchData1'),
                    sKey = oSource.getCustomData()[0].getKey();
                var aNewArr = []
                if (sKey === 'VC') {
                    var aData = oModel.getProperty("/aData1");
                    aData.map(function (items) {
                        if (items.Material === sInputValue) {
                            aNewArr.push(items)
                        }
                    })
                    aData.forEach(function (aNewArr) {
                        aNewArr.selected = (aNewArr.Material === sInputValue);
                    });
                    oModel.setProperty("/aData1", aData);
                }
            },
            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
                var oObject = oEvent.getParameter("selectedContexts")[0].getObject();
                //this.oSource = this.byId("productInput");

                // Actual Yarn Consumption used in yarn For That Logic is .............................Anshul Chechani.................................

                if (this.sPath1.slice(0, 1) === 'Y') {
                    var YarnPickReadSpace = this.getView().getModel('YarnPickReadSpace').getProperty("/YarnPickReadSpacelist");
                    var Pick = 0;
                    for (var i = 0; i < YarnPickReadSpace.length; i++) {
                        if (YarnPickReadSpace[i].Fabric === this.sPath6 && YarnPickReadSpace[i].Yarn === this.sPath1) {
                            Pick = YarnPickReadSpace[i].Pick;
                        }
                    }
                    var DENIER = oObject.DENIER;
                    var dl = parseInt(oObject.DENIER);
                    var denierlength = String(dl).length;
                    var targetqty = this.LengthFirst;

                    if (denierlength <= 2) {
                        var qtypcper = ((Number(Pick) / Number(DENIER)) / 1000) * Number(targetqty);
                    }
                    else {
                        var qtypcper = ((Number(Pick) / (5315 / Number(DENIER))) / 1000) * Number(targetqty);
                    }

                    var qtypcper1 = (qtypcper * 3.50) / 100;
                    var reqqty = qtypcper + qtypcper1;

                    reqqty = parseFloat(reqqty).toFixed(3)
                }



                // Actual Yarn Consumption used in yarn For That Logic is .............................Anshul Chechani.................................


                if (!oSelectedItem) {
                    this.oSource.resetProperty("value");
                    return;
                }
                if (this.sPath1.slice(0, 1) === 'Y') {
                    if (sPath.search('/aData1') !== -1) {
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).setnumber = oObject.DESCRIPTION;
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).reqqty = reqqty;
                        this.getView().getModel('oTableDataModel1').setProperty(this.sPath, this.getView().getModel('oTableDataModel1').getProperty(this.sPath));
                    }
                    else {
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).setnumber = oObject.DESCRIPTION;
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).reqqty = reqqty;
                        this.getView().getModel('oTableDataModel1').setProperty(this.sPath, this.getView().getModel('oTableDataModel1').getProperty(this.sPath));
                    }
                    this.oSource.setValue(oSelectedItem.getDescription());
                }
                else {

                    if (sPath.search('/aData1') !== -1) {
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).setnumber = oObject.DESCRIPTION;
                        this.getView().getModel('oTableDataModel1').setProperty(this.sPath, this.getView().getModel('oTableDataModel1').getProperty(this.sPath));
                    }
                    else {
                        this.getView().getModel('oTableDataModel1').getProperty(this.sPath).setnumber = oObject.DESCRIPTION;
                        this.getView().getModel('oTableDataModel1').setProperty(this.sPath, this.getView().getModel('oTableDataModel1').getProperty(this.sPath));
                    }
                    this.oSource.setValue(oSelectedItem.getDescription());
                }


            },
            f4setnumber: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oContext = oEvent.getSource().getBindingContext('oTableDataModel1').getObject();
                var material = oContext.itemcode;

                // var con = oEvent.getSource().getBindingContext("oTableDataModel1").getObject().WtperMeter 
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("a63", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "a63",
                        descriptionKey: "a63",
                        filtermode: "true",
                        enableBasicSearch: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Batch;

                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });

                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    // filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItemnew({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Product", control: new sap.m.Input() }),],




                    search: function (oEvt) {
                        oBusyDialog.open();

                        var Material = material;
                        oTable.bindRows({
                            path: "/GreyStock", filters: [
                                new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, Material)]
                        });


                        oBusyDialog.close();
                    }
                });



                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Plant", template: "Plant" },
                        { label: "Material", template: "Material" },
                        { label: "Batch", template: "Batch" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
            },
            // savedata: function () {
            //     var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
            //     for (var i = 0; i < table1.length; i++) {
            //         var k = i + 1;
            //         var sInput = table1[i].itemcode;
            //         var a = sInput.slice(0, 1);
            //         if (a != "Y") {
            //             var b = Number(table1[i].targetqty);
            //             var c = Number(table1[i].reqqty);
            //             if (b != c) {
            //                 MessageBox.error("Beam Target and Actual Consumption quantity mismatch", {
            //                     title: "Warning",
            //                     icon: MessageBox.Icon.ERROR
            //                 });
            //                 break;
            //             }
            //             else if (k === table1.length) {
            //                 this.savedata1();
            //             }

            //         }
            //         else if (k === table1.length) {
            //             this.savedata1();
            //         }
            //     }
            // },
            savedata: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();

                var docdate = this.getView().byId("docdate").getValue();
                var PostingDate = this.getView().byId("PostingDate").getValue();
                var challan = this.getView().byId("idchallan").getValue();
                // var delivery = this.getView().byId("delivery").getValue();


                if (docdate == "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Inspection Machine No.");
                }
                else if (PostingDate == "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Packgrade");
                }
                else if (challan == "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Gross Weight");
                }
                // else if (delivery == "") {
                //     oBusyDialog.close();
                //     MessageBox.error("Please fill the Delivery Note");
                // }
                else {
                    var docdate = this.getView().byId("docdate").getValue()
                    if (docdate.length === 10) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 7);
                        var dd = docdate.slice(8, 10);
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 9) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 7);
                        if (mm.slice(1, 2) === '-') {
                            var mm = docdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd = docdate.slice(7, 9);
                        }
                        else {
                            var mm = docdate.slice(5, 7);
                            var dd = docdate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 8) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = docdate.slice(7, 8);
                        dd = "0" + dd;
                        var dte = yyyy + mm + dd;
                    }

                    docdate = dte;

                    var PostingDate = this.getView().byId("PostingDate").getValue()
                    if (PostingDate.length === 10) {
                        var yyyy = PostingDate.slice(0, 4);
                        var mm = PostingDate.slice(5, 7);
                        var dd = PostingDate.slice(8, 10);
                        var dte1 = yyyy + mm + dd;
                    }
                    else if (PostingDate.length === 9) {
                        var yyyy = PostingDate.slice(0, 4);
                        var mm = PostingDate.slice(5, 7);
                        if (mm.slice(1, 2) === '-') {
                            var mm = PostingDate.slice(5, 6);
                            mm = "0" + mm;
                            var dd = PostingDate.slice(7, 9);
                        }
                        else {
                            var mm = PostingDate.slice(5, 7);
                            var dd = PostingDate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte1 = yyyy + mm + dd;
                    }
                    else if (PostingDate.length === 8) {
                        var yyyy = PostingDate.slice(0, 4);
                        var mm = PostingDate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = PostingDate.slice(7, 8);
                        dd = "0" + dd;
                        var dte1 = yyyy + mm + dd;
                    }
                    PostingDate = dte1;

                    var table = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                    var TableDataArray = [];
                    table.map(function (items) {

                        if (items.setnumber != "") {
                            var oTableData = {
                                sno: items.sno,
                                itemcode: items.itemcode,
                                descrption: items.descrption,
                                setnumber: items.setnumber,
                                movtype: items.movtype,
                                po: items.po,
                                beamlength: items.beamlength,
                                poitem: items.poitem,
                                supplier: items.supplier,
                                suppliername: items.suppliername,
                                piecenumber: items.piecenumber,
                                qtylength: items.Length,
                                UOM: items.UOM,
                                orderqty: items.orderqty,
                                pick: items.pick,
                                partychlaan: items.partychlaan,
                                loom: items.loom,
                                grossweight: items.grossweight,
                                tareweight: items.tareweight,
                                netweight: items.netwt,
                                // netweight: items.netweight,
                                // per_avg_mtr: items.per_avg_mtr,
                                per_avg_mtr: String(items.per_avg_mtr),
                                salesorder: items.salesorder,
                                solineitem: items.solineitem,
                                finishroll: items.finishroll,
                                partybeam: items.partybeam,
                                grey_recpit: items.grey_recpit,

                                // permtrporate:items.permtrporate
                            }
                            TableDataArray.push(oTableData);
                        }
                    }.bind(this))


                    var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
                    var TableDataArray1 = [];
                    table1.map(function (items) {
                        var oTableData = {
                            sno: items.SNO,
                            itemcode: items.itemcode,
                            descrption: items.descrption,
                            targetqty: items.targetqty,
                            reqqty: items.reqqty,
                            setnumber: items.setnumber,
                            qtytlength: items.qtytlength,
                            remainingqty: items.remainingqty,
                            setnumber: items.setnumber,
                            movtype: items.movtype,
                            itemok: items.itemok,
                            po: items.po,
                            poitem: items.poitem,
                            salesoder: items.salesoder,
                            Solineitem: items.Solineitem,
                            Remark: items.Remark
                        }
                        TableDataArray1.push(oTableData);
                    }.bind(this))
                    //  https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/zmm_grey_receipt_module_http?sap-client=080
                    var url = "/sap/bc/http/sap/zmm_grey_receipt_module_http?";
                    $.ajax({
                        type: "post",
                        url: url,
                        data: JSON.stringify({
                            docdate,
                            PostingDate,
                            challan,
                            // delivery,
                            TableDataArray,
                            TableDataArray1
                        }),
                        contentType: "application/json; charset=utf-8",
                        traditional: true,
                        success: function (data) {
                            oBusyDialog.close();
                            var meta = data.slice(0, 5);
                            var message = data.slice(5, 200);
                            if (meta === "ERROR") {
                                MessageBox.error(message, {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR
                                });
                            }
                            else {
                                MessageBox.success(data, {
                                    title: "Data Saved Succesfully",
                                    icon: MessageBox.Icon.success,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            window.location.reload();
                                        }
                                    }
                                });
                            }

                        }.bind(this),
                        error: function (error) {
                            oBusyDialog.close();
                            MessageBox.show(error, {
                                title: "Warning",
                                icon: MessageBox.Icon.ERROR
                            });
                        }
                        // success: function (data) {
                        //     oBusyDialog.close();
                        //     var folio = data.split(' ').slice(0, 1)[0];
                        //     var meta = data.slice(40);
                        //     var create = meta.split(' ').slice(0, 1)[0];
                        //     if (create === 'ERROR') {
                        //         MessageBox.error(meta);
                        //     }
                        //     else if (folio === 'Folio') {
                        //         MessageBox.error(data);
                        //     }
                        //     else {

                        //         var recbatch = {
                        //             recbatch: data.split(' ').slice(0, 1)[0],
                        //         };
                        //         this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(recbatch), "oCommonModel9");
                        //         var Data = {
                        //             Data: data.slice(40),
                        //         };
                        //         this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(Data), "oCommonModel3");
                        //         var table = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                        //         if (table.length > 0) {
                        //             this.ZDNMFAULTData();
                        //         }
                        //         MessageBox.alert(data
                        //             , {
                        //                 onClose: function (oAction) {
                        //                     if (oAction === MessageBox.Action.OK) {
                        //                         window.location.reload();
                        //                     }
                        //                 }
                        //             }
                        //         );
                        //     }
                        // }.bind(this),
                        // error: function (error) {
                        //     oBusyDialog.close();
                        //     MessageBox.error(error);
                        // }

                    });
                }

            },
            onpcnocheck22: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var pieceLength = this.getView().getModel("oPieceLengthModel").getProperty("/aPieceData")
                var pieceCheckData = this.getView().getModel("oPieceCheckModel").getProperty("/aPieceCheckData")
                var aNewArr = [];
                var pieceno = oContext.piecenumber;
                var setnumber = oContext.setnumber;
                var itemcode = oContext.itemcode;
                var oModel = this.getView().getModel();
                var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
                var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);
                var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);

                pieceCheckData.map(function (items) {
                    if (items.Piecenumber === pieceno && items.Itemcode === itemcode && items.Setnumber === setnumber) {
                        aNewArr.push("1")
                    }
                })

                if (aNewArr.length > 0) {
                    oContext.Loom = pieceLength[0].Loom
                    oContext.Length = pieceLength[0].Length
                    oContext.Pick = pieceLength[0].Pick
                    oContext.netwt = pieceLength[0].netwt
                }

                // oModel.read("/PieceChek", {
                //     urlParameters: { "$top": "100000" },
                //     filters: [oFilter, oFilter1, oFilter2],
                //     success: function (oresponse) {
                //         if (oresponse.results.length === 0) {
                //             oModel.read("/piecelength", {
                //                 urlParameters: { "$top": "100000" },
                //                 success: function (oresponse1) {
                //                     oresponse1.results.map(function (items) {
                //                         var obj = {
                //                             "Loom": items.Loom,
                //                             "Length": items.Length,
                //                             "Pick": items.Pick,
                //                             "netwt": items.netwt,
                //                         }
                //                         aNewArr.push(obj);
                //                     })
                //                     oContext.Loom = aNewArr[0].Loom
                //                     oContext.Length = aNewArr[0].Length
                //                     oContext.Pick = aNewArr[0].Pick
                //                     oContext.netwt = aNewArr[0].netwt

                //                 }.bind(this)
                //             })
                //         }
                //         else if (oresponse.results.length > 0) {
                //             MessageBox.error("Entered Piece already received against the set")
                //         }
                //     }.bind(this),
                //     error: function (error) {
                //         oBusyDialog.close();
                //         MessageBox.show("Entered Piece already received against the set", {
                //             title: "Warning!!!!!!",
                //             icon: MessageBox.Icon.ERROR
                //         });
                //     }

                // })

            },

            //Old Function Created
            onpcnocheck_old: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var pieceno = oContext.piecenumber;
                var setnumber = oContext.setnumber;
                var itemcode = oContext.itemcode;
                var aNewArr = [];
                var oModel = this.getView().getModel();
                var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
                var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);
                var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);
                oModel.read("/PieceChek", {
                    urlParameters: { "$top": "100000" },
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel.read("/piecelength", {
                                urlParameters: { "$top": "100000" },
                                success: function (oresponse1) {
                                    oresponse1.results.map(function (items) {
                                        var obj = {
                                            "Loom": items.Loom,
                                            "Length": items.Length,
                                            "Pick": items.Pick,
                                            "netwt": items.netwt,
                                        }
                                        aNewArr.push(obj);
                                    })
                                    oContext.Loom = aNewArr[0].Loom
                                    oContext.Length = aNewArr[0].Length
                                    oContext.Pick = aNewArr[0].Pick
                                    oContext.netwt = aNewArr[0].netwt

                                }.bind(this)
                            })

                        }
                        else if (oresponse.results.length > 0) {
                            MessageBox.error("Entered Piece already received against the set")
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusyDialog.close();
                        MessageBox.show("Entered Piece already received against the set", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }

                })




            },
            //Its New
            onpcnocheck111: function (oEvent) {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var pieceno = oContext.piecenumber;
                var setnumber = oContext.setnumber;
                var itemcode = oContext.itemcode;
                var aNewArr = [];
                var oComanModel = this.getView().getModel('oTableDataModel')
                var sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                var oModel = this.getView().getModel();
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
                var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);
                var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);

                var oFilter3 = new sap.ui.model.Filter("Rollno", "EQ", oEvent.mParameters.value);
                // var oFilter3 = new sap.ui.model.Filter("Partybeam", "EQ", oEvent.mParameters.value);

                oModel.read("/PieceChek", {
                    urlParameters: { "$top": "100000" },
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel1.read("/piecelength", {
                                urlParameters: { "$top": "100000" },
                                filters: [oFilter3],
                                success: function (ores) {
                                    if (ores.results.length != 0) {
                                        ores.results.map(function (items) {
                                            var obj = {
                                                "Loom": items.Loom,
                                                "Length": items.Length,
                                                "Pick": items.Pick,
                                                "netwt": items.netwt,

                                            }
                                            aNewArr.push(obj);
                                        })

                                        oComanModel.getProperty(sPath).Loom = aNewArr[0].Loom;
                                        oComanModel.getProperty(sPath).Length = aNewArr[0].Length;
                                        oComanModel.getProperty(sPath).Pick = aNewArr[0].Pick;
                                        oComanModel.getProperty(sPath).netwt = aNewArr[0].netwt;
                                        oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                    }
                                    oBusy.close();
                                }.bind(this)
                            })

                        }
                        else if (oresponse.results.length > 0) {
                            oBusy.close();
                            MessageBox.error("Entered Piece already received against the set")
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusy.close();
                        MessageBox.show("Entered Piece already received against the set", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }

                })




            },




            // onpcnocheck: function (oEvent) {
            //     var oBusy = new sap.m.BusyDialog({
            //         text: "Please Wait"
            //     });
            //     oBusy.open();
            //     var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
            //     var pieceno = oContext.piecenumber;
            //     var setnumber = oContext.setnumber;
            //     var itemcode = oContext.itemcode;
            //     // var Length  = oContext.Length;
            //     var aNewArr = [];
            //     var oComanModel = this.getView().getModel('oTableDataModel')
            //     var sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
            //     var oModel = this.getView().getModel();
            //     var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
            //     var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
            //     var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);
            //     var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);

            //     var oFilter3 = new sap.ui.model.Filter("Rollno", "EQ", oEvent.mParameters.value);
            //     // var oFilter3 = new sap.ui.model.Filter("Partybeam", "EQ", oEvent.mParameters.value);

            //     oModel.read("/PieceChek", {
            //         urlParameters: { "$top": "100000" },
            //         filters: [oFilter, oFilter1, oFilter2],
            //         success: function (oresponse) {
            //             if (oresponse.results.length === 0) {
            //                 oModel1.read("/piecelength", {
            //                     urlParameters: { "$top": "100000" },
            //                     filters: [oFilter3],
            //                     success: function (ores) {
            //                         if (ores.results.length != 0) {
            //                             ores.results.map(function (items) {
            //                                 var Length = items.Length;
            //                                 var NewWeight = items.netwt;
            //                                 var avgWeight = NewWeight / Length ;
            //                                 var obj = {

            //                                     "Loom": items.Loom,
            //                                     "Length": items.Length,
            //                                     "Pick": items.Pick,
            //                                     "netwt": items.netwt,
            //                                     "permtravgweight": avgWeight,
            //                                 }
                                            
            //                                 aNewArr.push(obj);
            //                             })

            //                             oComanModel.getProperty(sPath).Loom = aNewArr[0].Loom;
            //                             oComanModel.getProperty(sPath).Length = aNewArr[0].Length;
            //                             oComanModel.getProperty(sPath).Pick = aNewArr[0].Pick;
            //                             oComanModel.getProperty(sPath).netwt = aNewArr[0].netwt;
            //                             oComanModel.getProperty(sPath).permtravgweight = aNewArr[0].permtravgweight;

            //                             oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
            //                         }
            //                         oBusy.close();
            //                     }.bind(this)
            //                 })

            //             }
            //             else if (oresponse.results.length > 0) {
            //                 oBusy.close();
            //                 MessageBox.error("Entered Piece already received against the set")
            //             }
            //         }.bind(this),
            //         error: function (error) {
            //             oBusy.close();
            //             MessageBox.show("Entered Piece already received against the set", {
            //                 title: "Warning!!!!!!",
            //                 icon: MessageBox.Icon.ERROR
            //             });
            //         }

            //     })




            // },


            onpcnocheck: function (oEvent) {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var oContext = oEvent.getSource().getBindingContext("oTableDataModel").getObject();
                var pieceno = oContext.piecenumber;
                // var party_beam = oContext.partybeam;
                var setnumber = oContext.setnumber;
                var itemcode = oContext.itemcode;
                // var Loom_number  = oContext.Loom;
                var aNewArr = [];
                var oComanModel = this.getView().getModel('oTableDataModel')
                var sPath = oEvent.getSource().getBindingContext('oTableDataModel').getPath();
                var oModel = this.getView().getModel();
                var oModel1 = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZMM_GREY_RECEIPT_BIN");
                var oFilter = new sap.ui.model.Filter("Piecenumber", "EQ", pieceno);
                var oFilter1 = new sap.ui.model.Filter("Setnumber", "EQ", setnumber);
                var oFilter2 = new sap.ui.model.Filter("Itemcode", "EQ", itemcode);

                var oFilter3 = new sap.ui.model.Filter("Rollno", "EQ", oEvent.mParameters.value);
                // var oFilter3 = new sap.ui.model.Filter("Partybeam", "EQ", oEvent.mParameters.value);

                // var oFilter4 = new sap.ui.model.Filter("Partybeam", "EQ", party_beam);
                // var oFilter5 = new sap.ui.model.Filter("Loom", "EQ", Loom_number);
                var oFilter6 = new sap.ui.model.Filter("dyebeam", "EQ", setnumber);

                oModel.read("/PieceChek", {
                    urlParameters: { "$top": "100000" },
                    filters: [oFilter, oFilter1, oFilter2],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oModel1.read("/piecelength", {
                                urlParameters: { "$top": "100000" },
                                filters: [oFilter3, oFilter6],
                                success: function (ores) {
                                    if (ores.results.length != 0) {
                                        ores.results.map(function (items) {
                                            var Length = items.Length;
                                            var NewWeight = items.netwt;
                                            var avgWeight = String(NewWeight / Length) ;
                                            var obj = {

                                                "Loom": items.Loom,
                                                "Length": items.Length,
                                                "Pick": items.Pick,
                                                "netwt": items.netwt,
                                                "per_avg_mtr": avgWeight,
                                            }
                                            
                                            aNewArr.push(obj);
                                        })

                                        oComanModel.getProperty(sPath).Loom = aNewArr[0].Loom;
                                        oComanModel.getProperty(sPath).Length = aNewArr[0].Length;
                                        oComanModel.getProperty(sPath).Pick = aNewArr[0].Pick;
                                        oComanModel.getProperty(sPath).netwt = aNewArr[0].netwt;
                                        oComanModel.getProperty(sPath).per_avg_mtr = aNewArr[0].per_avg_mtr;

                                        oComanModel.setProperty(sPath, oComanModel.getProperty(sPath))
                                    }
                                    oBusy.close();
                                }.bind(this)
                            })

                        }
                        else if (oresponse.results.length > 0) {
                            oBusy.close();
                            MessageBox.error("Entered Piece already received against the set")
                        }
                    }.bind(this),
                    error: function (error) {
                        oBusy.close();
                        MessageBox.show("Entered Piece already received against the set", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                    }

                })




            },

            RowSelector: function () {
                debugger;
            }


        });
    });
