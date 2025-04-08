package com.endava.endavastrength.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;


/**
 * Aspect for intercepting method executions within controllers and services
 * to log method execution details.
 */
@Aspect
@Slf4j
@Component
public class Logger {
	
	private static final String METHOD_PREFIX = "Method ";
    /**
     * Pointcut that matches all methods in the controllers package, excluding methods in this aspect.
     */
	@Pointcut("execution(* com.endava.endavastrength.controllers..*(..)) && !within(com.endava.endavastrength.aspect..*)")
	public void loggingPointCutForControllers() {}

    /**
     * Pointcut that matches all methods in the serviceImpl package, excluding methods in this aspect.
     */
	@Pointcut("execution(* com.endava.endavastrength.service.impl..*(..)) && !within(com.endava.endavastrength.aspect..*)")
	public void loggingPointCutForServices() {}

    /**
     * Logs the method name after a successful execution of controller methods.
     *
     * @param joinPoint The join point for the method execution.
     * @param result The result returned by the method.
     */
	@AfterReturning(pointcut = "loggingPointCutForControllers()", returning = "result")
    public void logAfterReturningForControllers(JoinPoint joinPoint, Object result) {
        log.info(METHOD_PREFIX + joinPoint.getSignature().getName()); 
    }

    /**
     * Logs the method name and exception message when a controller method throws an exception.
     *
     * @param joinPoint The join point for the method execution.
     * @param exception The exception thrown by the method.
     */
    @AfterThrowing(pointcut = "loggingPointCutForControllers()", throwing = "exception")
    public void logAfterThrowingForControllers(JoinPoint joinPoint, Throwable exception) {
    	log.info(METHOD_PREFIX + joinPoint.getSignature().getName() + " threw exception: " + exception.getMessage());
    }
    
    
    /**
     * Logs before and after a controller method is executed.
     * 
     * @param joinPoint The join point for the method execution.
     * @return The result of the method execution.
     * @throws Throwable if the method execution throws an exception.
     */
    @Around("loggingPointCutForControllers()")
    public Object aroundLoggingForControllers(ProceedingJoinPoint joinPoint) throws Throwable {
    	long startTime = System.currentTimeMillis();
    	log.info("Before controller method: " + joinPoint.getSignature().getName());
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - startTime;
        log.info("After controller method: " + joinPoint.getSignature().getName()+ " | Execution time: " + duration + " ms");
        return result;
    }
    
    
    /**
     * Logs the method name after a successful execution of service methods.
     *
     * @param joinPoint The join point for the method execution.
     * @param result The result returned by the method.
     */
    @AfterReturning(pointcut = "loggingPointCutForServices()", returning = "result")
    public void logAfterReturningForServices(JoinPoint joinPoint, Object result) {
        log.info(METHOD_PREFIX + joinPoint.getSignature().getName());
    }

    
    /**
     * Logs the method name and exception message when a service method throws an exception.
     *
     * @param joinPoint The join point for the method execution.
     * @param exception The exception thrown by the method.
     */
    @AfterThrowing(pointcut = "loggingPointCutForServices()", throwing = "exception")
    public void logAfterThrowingForServices(JoinPoint joinPoint, Throwable exception) {
    	log.info(METHOD_PREFIX + joinPoint.getSignature().getName() + " threw exception: " + exception.getMessage());
    }
    
    
    /**
     * Logs before and after a service method is executed.
     * 
     * @param joinPoint The join point for the method execution.
     * @return The result of the method execution.
     * @throws Throwable if the method execution throws an exception.
     */
    @Around("loggingPointCutForServices()")
    public Object aroundLoggingForServices(ProceedingJoinPoint joinPoint) throws Throwable {
    	long startTime = System.currentTimeMillis();
    	log.info("Before service method: " + joinPoint.getSignature().getName());
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - startTime;
        log.info("After service method: " + joinPoint.getSignature().getName()+ " | Execution time: " + duration + " ms");
        return result;
    }
}