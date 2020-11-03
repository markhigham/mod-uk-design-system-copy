import React, { useCallback, useState } from 'react'
import classNames from 'classnames'

import {
  Slider,
  SliderProps,
  Rail,
  Handles,
  Tracks,
  Ticks,
} from 'react-compound-slider'

import {
  Handle,
  RangeSliderValueFormatter,
  Track,
  ThresholdTrack,
  Tick,
} from '.'

export interface RangeSliderProps
  extends Omit<SliderProps, 'children' | 'disabled' | 'reversed'> {
  hasLabels?: boolean
  tracksLeft?: boolean
  tracksRight?: boolean
  tickCount?: number
  IconLeft?: React.ElementType
  IconRight?: React.ElementType
  isDisabled?: boolean
  isReversed?: boolean
  thresholds?: number[]
  hasPercentage?: boolean
  displayUnit?: string
  formatValue?: RangeSliderValueFormatter
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  className,
  domain,
  step,
  hasLabels,
  tracksLeft = false,
  tracksRight = false,
  tickCount = 10,
  IconLeft,
  IconRight,
  isReversed,
  isDisabled,
  values,
  onUpdate,
  thresholds,
  hasPercentage,
  displayUnit = '',
  formatValue,
  ...rest
}) => {
  const [sliderValues, setSliderValues] = useState(values)

  const onUpdateHandler = useCallback(
    (newValues: ReadonlyArray<number>): void => {
      setSliderValues(newValues)

      if (onUpdate) {
        onUpdate(newValues)
      }
    },
    [onUpdate, setSliderValues]
  )

  const formatValueDefault: RangeSliderValueFormatter = useCallback(
    ({ value }) => `${Math.floor(value)}${displayUnit}`,
    [displayUnit]
  )

  const classes = classNames('rn-rangeslider', className, {
    'is-reversed': isReversed,
    'is-disabled': isDisabled,
    'has-percentage': hasPercentage,
  })

  return (
    <div className={classes} data-testid="rangeslider">
      {IconLeft && (
        <IconLeft
          aria-hidden
          className="rn-rangeslider__icon rn-rangeslider__icon--left"
          data-testid="rangeslider-icon-left"
        />
      )}
      <Slider
        domain={domain}
        reversed={isReversed}
        disabled={isDisabled}
        values={values}
        step={step}
        onUpdate={onUpdateHandler}
        {...rest}
      >
        <Rail>
          {({ getRailProps }) => (
            <div className="rn-rangeslider__rail">
              <div className="rn-rangeslider__rail-inner" {...getRailProps()} />
            </div>
          )}
        </Rail>
        <Handles>
          {({ activeHandleID, handles, getHandleProps }) => (
            <div className="rn-rangeslider__handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  activeHandleID={activeHandleID}
                  getHandleProps={getHandleProps}
                  formatValue={formatValue ?? formatValueDefault}
                  thresholds={thresholds}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={tracksLeft} right={tracksRight}>
          {({ tracks, getTrackProps }) => (
            <div className="rn-rangeslider__tracks">
              {tracks.map(({ id, source, target }) => {
                if (thresholds) {
                  return (
                    <ThresholdTrack
                      id={id}
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                      thresholds={thresholds}
                    />
                  )
                }

                return (
                  <Track
                    id={id}
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                )
              })}
            </div>
          )}
        </Tracks>
        {tickCount && (
          <Ticks count={tickCount}>
            {({ ticks }) => (
              <div className="rn-rangeslider__ticks">
                {ticks.map((tick) => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    hasLabels={hasLabels}
                    values={sliderValues}
                    domain={domain}
                    isReversed={isReversed}
                    thresholds={thresholds}
                  />
                ))}
              </div>
            )}
          </Ticks>
        )}
      </Slider>
      {IconRight && (
        <IconRight
          aria-hidden
          className="rn-rangeslider__icon rn-rangeslider__icon--right"
          data-testid="rangeslider-icon-right"
        />
      )}
    </div>
  )
}

RangeSlider.displayName = 'RangeSlider'
