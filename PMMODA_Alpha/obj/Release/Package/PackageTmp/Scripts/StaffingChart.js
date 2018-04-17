"use strict";


var StaffingChart = function (canvas, top, left,width,height,pixelScale) {
    var _Canvas = canvas;
    var _Top = top;
    var _Left = left;
    var _Width = width;
    var _Height = height;
    // Declare a variable to store the pixels per day value for the chart
    var pixelsPerDay = pixelScale;
    // Declare a variable to store the minimum y Axis position and value
    var minYPosition = _Top+_Height-20;
    var minYValue = 0;
    var maxYPosition = _Top+30;
    var maxYValue = 0;
    // Declare a variable to store the minimum x axis position and value
    var minXPosition = _Left+20;
    var minXValue = 0;
    var maxXPosition = _Left + _Width-20;
    var maxXValue = 0;
    var xOffset = 50;
    var yOffset = 30;
    // Declare a local object to store the graph color array
    var colors = new Array("orange", "yellowgreen", "#80C1DD", "#639e4b", "#4b9e5c", "#4b9e85", "#4b8d9e", "#4b639e", "#5c4b9e", "#854b9e", "#9e488d", "#9e4b63");

    // declare an object to store the title
    this.Title;
    // Declare a collection to store the x axis data set
    // Declare a collection to store the x-Axis data
    this.AxisData = [];

    // Declare a collection to store the line chart data sets
    var DataSet = [];

    var AddData = function (data) {
        if (DataSet == undefined) {
            DataSet = new Array();
        }
        DataSet.push(data);
    }

    // Declare a function to draw the graph
    var Draw = function () {
        var context = _Canvas.getContext("2d");
        context.scale(1, 1);
        // Clear the current results
        context.clearRect(0, 0, _Canvas.width, _Canvas.height);
        // draw the frame for the line chart
        drawFrame(context);
        // Draw the graph axes
        drawAxes(context);
        // Calculate the display ranges
        calculateDisplayRanges(this.AxisData, DataSet);
        //Draw the axis data labels
        drawAxisDataLabels(context);
        // draw the data curves
        drawData(context, this.AxisData);
    };

    var drawAxisDataLabels = function (context) {
        var scaleY = 0;
        var xScale = 0;
        var current = yOffset;
        var yRange;
        // Calculate the y Axis scale
        yRange = maxYValue - minYValue;
        // make sure the vertical separations are not less than 1
        if (yRange < 5) {
            scaleY = 1;
            //            drawVerticalTicks(context, xOffset, 30, _Height - 20, scaleY);
        }
        else {
            scaleY = yRange / 5;
            scaleY = Math.round(scaleY);
//            drawVerticalTicks(context, xOffset, 30, _Height - 20, scaleY);
        }

        context.strokeStyle = "black";
        context.linewidth = 2;
        var currentValue = yRange;
        while (current < yOffset + _Height-20) {
            context.beginPath();
            context.moveTo(xOffset, current);
            context.lineTo(xOffset - 5, current);
            context.stroke();
            // Draw the label
            context.fillText(currentValue.toString(), xOffset - 20, current)
            current += (_Height-yOffset-20) / yRange;
            currentValue = currentValue - scaleY;
        }


    };

    var drawVerticalTicks = function (context, left, top, bottom, count) {
        var current = top;

    };

    var calculateDisplayRanges = function (xData, yData) {
        var index = 0;
        var setCounter=0;

        // loop over the x data and get the min and max value
        while (index < xData.length) {
            if (xData[index] < minXValue) {
                minXValue = xData[index];
            }
            if (xData[index] > maxXValue) {
                maxXValue = xData[index];
            }
            index++;
        }

        // loop over the y data sets and get the min and max value
        while (setCounter < yData.length) {
            // loop over the data points in the current set
            index = 0;
            while (index < yData[setCounter].length) {
                if (yData[setCounter][index] < minYValue) {
                    minYValue = yData[setCounter][index];
                }
                if (yData[setCounter][index] > maxYValue) {
                    maxYValue = yData[setCounter][index];
                }
                index++;
            }
            setCounter++;
        }

        maxYValue = Math.round(maxYValue * 1.1);
        maxXValue = Math.round(maxXValue);
    }

    var drawData = function (context,axisData) {
        var index = 0;
        var dataPoint = 0;



        // Loop over the current data set
        while (index < DataSet.length) {
            var xValue;
            var yValue;
            var scaleFactor = 0;

            context.strokeStyle = colors[index];
            context.lineWidth = 4;
            context.beginPath();
            dataPoint = 0;
            // loop over the data points
            while (dataPoint < DataSet[index].length) {

                xValue = xOffset + (axisData[dataPoint] * pixelsPerDay);
                scaleFactor =  ((maxXPosition - minXPosition) / (maxXValue - minXValue));
                yValue = minYPosition - (DataSet[index][dataPoint] * ((minYPosition - maxYPosition) / (maxYValue - minYValue)));
                if (dataPoint == 0) {
                    context.moveTo(xValue, yValue);
                }
                else {
                    context.lineTo(xValue, yValue);
                }

                dataPoint++;
            }
            context.stroke();
            index++;
        }

    }

    // Declare a function to draw the  X and Y axes for the current graph
    var drawAxes = function (context) {
        context.strokeStyle = "black";
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(xOffset, top + yOffset);
        context.lineTo(xOffset, top + _Height - 20);
        context.lineTo(_Width - 20, top + _Height - 20);
        context.stroke();

    };

    var drawFrame = function (context) {

        context.strokeStyle = "gray";
        context.lineWidth = 2;
        context.strokeRect(_Left,_Top,_Width,_Height)

    };

    return {
        AddData: AddData,
        Draw: Draw
    };
}